import {FileEarmarkPlusFill, GearFill, Play, SaveFill, Trash2Fill} from "react-bootstrap-icons";
import {ReportActionsContext, ReportMetadataContext} from '../../contexts/ReportBuilderContext';
import {ReportSvc} from "../../services";
import {useHistory} from "react-router-dom";

export default function ReportActionsBar() {
    const history = useHistory();
    const reportActions = ReportActionsContext();
    const reportMetaData = ReportMetadataContext();

    const runReport = async () => {
        await reportActions.runReport();
    };

    const deleteReport = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure??")
        if (confirmed) {
            const resp = await ReportSvc.deleteReport(reportMetaData.id);
            if (resp) {
                history.push("/reportsHome")
            }
        }
    };

    return (
        <div className="row actions-bar">
            <div className="col">
                <button type="button" className="btn btn-labeled btn-secondary">
                                <span className="btn-label">
                                    <SaveFill/>
                                </span>
                    Save
                </button>
                <button type="button" className="btn btn-light">
                                <span className="btn-label">
                                    <GearFill/>
                                </span>
                    Settings
                </button>
                <button type="button" className="btn btn-light">
                                <span className="btn-label">
                                    <FileEarmarkPlusFill/>
                                </span>
                    Duplicate
                </button>
                <button type="button" className="btn btn-light" onClick={deleteReport}>
                                <span className="btn-label">
                                    <Trash2Fill/>
                                </span>
                    Delete
                </button>

                <button type="button" className="btn btn-outline-secondary" onClick={runReport}>
                                <span className="btn-label">
                                    <Play/>
                                </span>
                    Run
                </button>
            </div>
        </div>
    );
}