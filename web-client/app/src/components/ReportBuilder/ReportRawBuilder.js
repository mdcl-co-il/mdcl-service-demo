import {ReportProvider} from '../../contexts/ReportBuilderContext'
import ReportActionsBar from "./ReportActionsBar";
import ReportEditArea from "./ReportEditArea";
import ReportBreadCrumbs from "./ReportBreadCrumbs";

export default function ReportRawBuilder() {
    return (
        <>
            <ReportProvider>
                <ReportBreadCrumbs/>
                <ReportActionsBar/>
                <ReportEditArea/>
            </ReportProvider>
        </>
    );
}