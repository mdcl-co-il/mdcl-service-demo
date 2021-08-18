import {FormsSvc, UtilsSvc} from '../services'
import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import FileImportModalRedux from "../components/Entities/FileImport/FileImportModalRedux";

export default function EntitiesHome() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState([]);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteConfirmModalCtx, setDeleteConfirmModalCtx] = useState({});
    const [activeEntityImport, setActiveEntityImport] = useState(null);
    const [showFileImportModal, setShowFileImportModal] = useState(false);

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

    const importFromFile = async (entityId) => {
        setActiveEntityImport(entityId);
        setShowFileImportModal(true);
    };

    const loadFromFileCompletedHandler = async () => {
        setShowFileImportModal(false);
        await loadEntities();
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
                                    <Link to={'/entityReport/new/' + row.id + '/0'} className="forms-list-btn">
                                        <button type="button" className="btn btn-sm btn-outline-dark">
                                            Entity Report
                                        </button>
                                    </Link>
                                    <button type="button" className="btn btn-sm btn-outline-dark forms-list-btn"
                                            onClick={() => importFromFile(row.id)}>Import From File
                                    </button>
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

            <FileImportModalRedux
                show={showFileImportModal}
                onHide={() => loadFromFileCompletedHandler()}
                data={{entityId: activeEntityImport}}
            />
        </>
    );
}