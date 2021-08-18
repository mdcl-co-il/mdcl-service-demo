import {createContext, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {ReportSvc} from "../services";

const ReportMetadataCtx = createContext({});
const ReportColumnsCtx = createContext({});
const ReportColumnUpdateCtx = createContext({});
const ReportActionsCtx = createContext({});
const ReportResultsCtx = createContext({});

export function ReportMetadataContext() {
    return useContext(ReportMetadataCtx);
}

export function ReportColumnsContext() {
    return useContext(ReportColumnsCtx);
}

export function ReportColumnUpdateContext() {
    return useContext(ReportColumnUpdateCtx);
}

export function ReportActionsContext() {
    return useContext(ReportActionsCtx);
}

export function ReportResultsContext() {
    return useContext(ReportResultsCtx);
}

export function ReportProvider({children}) {
    let {report_id} = useParams();
    const [reportMetadata, setReportMetadata] = useState({});
    const [reportColumns, setReportColumns] = useState({});
    const [reportResults, setReportResults] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const loadReport = async () => {
            setLoading(true);
            const reportMD = await ReportSvc.loadReport(report_id);
            setReportMetadata(reportMD);
            if (reportMD.columns) {
                setReportColumns(JSON.parse(reportMD.columns));
            }
            setLoading(false);
        };
        loadReport();
        return () => {
        };
    }, [report_id]);

    const updateReportColumns = (columns) => {
        setReportColumns(columns);
        console.log("updateReportColumns", columns);
        ReportSvc.updateReportColumns(reportMetadata.id, columns);
    };

    const reportActions = {
        runReport: async () => {
            const results = await ReportSvc.runReport({
                columns: reportColumns
            }, true);
            setReportResults(results);
        }
    }

    return (
        <>
            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <>
                    <ReportMetadataCtx.Provider value={reportMetadata}>
                        <ReportColumnsCtx.Provider value={reportColumns}>
                            <ReportColumnUpdateCtx.Provider value={updateReportColumns}>
                                <ReportActionsCtx.Provider value={reportActions}>
                                    <ReportResultsCtx.Provider value={reportResults}>
                                        {children}
                                    </ReportResultsCtx.Provider>
                                </ReportActionsCtx.Provider>
                            </ReportColumnUpdateCtx.Provider>
                        </ReportColumnsCtx.Provider>
                    </ReportMetadataCtx.Provider>
                </>
            )}
        </>
    );
}
