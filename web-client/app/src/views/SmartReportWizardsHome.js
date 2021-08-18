import {UtilsSvc, WizardsSvc} from '../services'
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {WizardActionsContext, WizardsListDataContext} from "../contexts/ReportsWizardsContext";
import ConfirmModal from "../components/ConfirmModal";

export default function SmartReportWizardsHome() {
    const wizardsList = WizardsListDataContext();
    const wizardActions = WizardActionsContext();
    const history = useHistory();
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteConfirmModalCtx, setDeleteConfirmModalCtx] = useState({});


    const newWizard = async (e) => {
        const wizardId = await WizardsSvc.newWizard();
        e.preventDefault();
        history.push("/smartReport/Wizard/" + wizardId);
    };

    const deleteWizard = async (id) => {
        const wizardToDelete = wizardsList.filter(wizard => wizard.id === id)[0];
        const deleteConfirmModalCtx = {
            message: `Are you sure you want to delete '${wizardToDelete.title}' Wizard?`,
            confirm: async (result) => {
                if (result) {
                    await wizardActions.deleteWizard(id);
                    setShowDeleteConfirmModal(false);
                } else {
                    setShowDeleteConfirmModal(false);
                }
            }
        };
        setDeleteConfirmModalCtx(deleteConfirmModalCtx);
        setShowDeleteConfirmModal(true);
    };

    return (
        <>
            <ConfirmModal
                show={showDeleteConfirmModal}
                ctx={deleteConfirmModalCtx}
            >
            </ConfirmModal>
            <h3>Smart Report Wizards</h3>
            <button type="button" className="btn btn-outline-dark" onClick={newWizard}>New Wizard</button>
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
                    {wizardsList.map((row, i) =>
                        <tr key={'form_' + row.id}>
                            <td>{row.title}</td>
                            <td>{UtilsSvc.formatTimeStampToString(row.lastModifiedDate)}</td>
                            <td>
                                <Link to={'/smartReport/Wizard/' + row.id}
                                      className="forms-list-btn">
                                    <button type="button" className="btn btn-sm btn-outline-dark">Edit</button>
                                </Link>
                                <button type="button" className="btn btn-sm btn-outline-danger forms-list-btn"
                                        onClick={() => deleteWizard(row.id)}>Delete
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}