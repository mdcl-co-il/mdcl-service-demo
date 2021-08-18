import {FormsSvc, UtilsSvc} from '../services'
import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

export default function EntitiesHome() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState([]);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteConfirmModalCtx, setDeleteConfirmModalCtx] = useState({});

    const newForm = async (e) => {
        const formId = await FormsSvc.newForm();
        e.preventDefault();
        history.push("/entityEditor/" + formId);
    };

    const deleteEntity = async (id) => {
        const formToDelete = forms.filter(form => form.id === id)[0];
        const deleteConfirmModalCtx = {
            message: `Are you sure you want to delete '${formToDelete.title}' Entity?`,
            confirm: async (result) => {
                if (result) {
                    await FormsSvc.deleteForm(id);
                    setShowDeleteConfirmModal(false);
                    await loadEntities();
                } else {
                    setShowDeleteConfirmModal(false);
                }
            }
        };
        setDeleteConfirmModalCtx(deleteConfirmModalCtx);
        setShowDeleteConfirmModal(true);
    };

    const loadEntities = async () => {
        setLoading(true);
        const forms = await FormsSvc.loadForms();
        setForms(forms);
        setLoading(false);
    };

    useEffect(() => {
        loadEntities()
            .then(() => {

            })
    }, []);

    return (
        <>
            <ConfirmModal
                show={showDeleteConfirmModal}
                ctx={deleteConfirmModalCtx}
            >
            </ConfirmModal>
            <h3>Entities</h3>
            <button type="button" className="btn btn-outline-dark" onClick={newForm}>New Entity</button>
            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Last Update</th>
                            <th scope="col">Fills</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {forms.map((row, i) =>
                            <tr key={'form_' + row.id}>
                                <td>{row.title}</td>
                                <td>{UtilsSvc.formatTimeStampToString(row.lastModifiedDate)}</td>
                                <td>{row.fillCount}</td>
                                <td>
                                    <Link to={'/entityEditor/' + row.id} className="forms-list-btn">
                                        <button type="button" className="btn btn-sm btn-outline-dark">Edit
                                        </button>
                                    </Link>
                                    <Link to={'/formFill/' + row.id} className="forms-list-btn">
                                        <button type="button" className="btn btn-sm btn-outline-dark">Fill Form
                                        </button>
                                    </Link>
                                    <button type="button" className="btn btn-sm btn-outline-danger forms-list-btn"
                                            onClick={() => deleteEntity(row.id)}>Delete
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}