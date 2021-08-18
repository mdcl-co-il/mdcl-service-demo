import {ReportSvc, UtilsSvc} from '../services'
import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

export default function ReportsHome() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);

    const newReport = async (e) => {
        const reportId = await ReportSvc.newReport();
        e.preventDefault();
        history.push("/reportEditor/" + reportId);
    }

    useEffect(() => {
        const loadReports = async () => {
            setLoading(true);
            const reports = await ReportSvc.loadReports();
            setReports(reports);
            setLoading(false);
        };
        loadReports();
        return () => {
        };
    }, []);

    return (
        <>
            <h3>Reports</h3>
            <button type="button" className="btn btn-outline-dark" onClick={newReport}>New Report</button>
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
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((row, i) =>
                            <tr key={'report_row_' + row.id}>
                                <td>{row.title}</td>
                                <td>{UtilsSvc.formatTimeStampToString(row.lastUpdate)}</td>
                                <td>
                                    <Link to={'/reportEditor/' + row.id}>
                                        <button type="button" className="btn btn-sm btn-outline-dark">Edit Report
                                        </button>
                                    </Link>
                                    <Link to={'/rawReport/' + row.id}>
                                        <button type="button" className="btn btn-sm btn-outline-dark">Edit Report
                                            (raw)
                                        </button>
                                    </Link>
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