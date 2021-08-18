import {HouseFill} from "react-bootstrap-icons";
import {ReportMetadataContext} from "../../contexts/ReportBuilderContext";
import {ReportSvc} from "../../services";

export default function ReportBreadCrumbs() {
    const reportMetadata = ReportMetadataContext();

    const titleOnBlurHandler = async (e) => {
        await ReportSvc.updateReportTitle(reportMetadata.id, e.target.value)
    };

    return (
        <div className="row breadcrumb-bar">
            <div className="col">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><HouseFill/></li>
                        <li className="breadcrumb-item">Strategy</li>
                        <li className="breadcrumb-item">Reports</li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <input type="text" defaultValue={reportMetadata.title}
                                   maxLength={100}
                                   onBlur={titleOnBlurHandler}/>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    );
}