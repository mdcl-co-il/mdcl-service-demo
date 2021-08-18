import {FormsSvc, UtilsSvc} from '../services'
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import InstantRunModal from "../components/Reports/InstantRunModal";
import ConfirmModal from "../components/ConfirmModal";

export default function EntityReportsHome() {
    const [loading, setLoading] = useState(false);
    const [entityReports, setEntityReports] = useState([]);
    const [instantRunActive, setInstantRunActive] = useState(false);
    const [activeReportId, setActiveReportId] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteConfirmModalCtx, setDeleteConfirmModalCtx] = useState({});


    const runInstantReport = (entityReportId) => {
        setActiveReportId(entityReportId);
        setInstantRunActive(true);
    };


    const deleteEntityReport = async (id) => {
        const entityReportToDelete = entityReports.filter(entity => entity.id === id)[0];
        const deleteConfirmModalCtx = {
            message: `Are you sure you want to delete '${entityReportToDelete.title}' Entity report?`,
            confirm: async (result) => {
                if (result) {
                    await FormsSvc.deleteReport(id);
                    setShowDeleteConfirmModal(false);
                    await loadEntityReports();
                } else {
                    setShowDeleteConfirmModal(false);
                }
            }
        };
        setDeleteConfirmModalCtx(deleteConfirmModalCtx);
        setShowDeleteConfirmModal(true);
    };

    const loadEntityReports = async () => {
        setLoading(true);
        const entityReports = await FormsSvc.getReports();
        setEntityReports(entityReports);
        setLoading(false);
    };

    useEffect(() => {
        loadEntityReports()
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
            <h3>Entity Reports</h3>
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
                            <th scope="col">&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entityReports.map((row, i) =>
                            <tr key={'form_' + row.id}>
                                <td>{row.title}</td>
                                <td>{UtilsSvc.formatTimeStampToString(row.lastModifiedDate)}</td>
                                <td>
                                    <Link to={'/entityReport/edit/' + row.baseForm + '/' + row.id}
                                          className="forms-list-btn">
                                        <button type="button" className="btn btn-sm btn-outline-dark">Edit</button>
                                    </Link>
                                    <button type="button" className="btn btn-sm btn-info forms-list-btn"
                                            onClick={() => runInstantReport(row.id)}>Instant Run
                                    </button>
                                    <button type="button" className="btn btn-sm btn-outline-danger forms-list-btn"
                                            onClick={() => deleteEntityReport(row.id)}>Delete
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <InstantRunModal
                        show={instantRunActive}
                        onHide={() => setInstantRunActive(false)}
                        reportid={activeReportId}
                    />
                </div>
            )}
        </>
    );
}