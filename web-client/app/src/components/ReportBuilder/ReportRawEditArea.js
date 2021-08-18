import ReportColumns from "./ReportColumns";
import ReportFieldSelection from "./ReportFieldSelection";

export default function ReportRawEditArea() {
    return (
        <div className="row edit-area">
            Raw edit
            <div className="col-3">
                <ReportFieldSelection/>
            </div>


            <div className="col-9 main-edit-area">
                <div className="card">
                    <div className="card-header">
                        Filters
                    </div>
                    <div className="card-body">
                        This is some text within a card body.
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        Group By
                    </div>
                    <div className="card-body">
                        This is some text within a card body.
                    </div>
                </div>

                <div className="card">
                    <ReportColumns/>
                </div>

            </div>
        </div>
    );
}