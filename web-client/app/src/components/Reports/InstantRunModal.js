import BootstrapTable from 'react-bootstrap-table-next';
import {Modal} from 'react-bootstrap'
import {FormsSvc} from '../../services'
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {CSVLink} from "react-csv";

export default function InstantRunModal(props) {
    const [loading, setLoading] = useState(true);
    const [reportMetadata, setReportMetadata] = useState({});
    const [reportData, setReportData] = useState(null);
    const {register, handleSubmit} = useForm();
    const [reportDataForTable, setReportDataForTable] = useState(null);

    const onSubmit = async (data) => {
        const inputVariables = [];
        for (let variableName in data) {
            inputVariables.push({
                name: variableName,
                value: data[variableName]
            })
        }
        const reportData = await FormsSvc.runReport(reportMetadata, inputVariables);
        setReportData(reportData);

        if (reportData) {
            const reportDataForTable = {
                columns: reportData.columns.map(colName => {
                    return {
                        dataField: colName,
                        text: colName,
                        sort: true
                    }
                }),
                rows: reportData.rows.map(row => {
                    let formattedRow = {};
                    let i = 0;
                    reportData.columns.forEach(col => {
                        formattedRow[col] = row[i];
                        i++;
                    });
                    return formattedRow;
                })
            };
            setReportDataForTable(reportDataForTable);
        }
    };

    useEffect(() => {
        const loadEntityReport = async () => {
            setLoading(true);
            const reportMetadata = await FormsSvc.getEntityReport(props.reportid);
            setReportMetadata(reportMetadata);
            setLoading(false);
        };
        if (props.reportid) {
            loadEntityReport()
                .then(() => {

                });
        }

        return () => {
        };
    }, [props]);


    return (
        <>
            <Modal
                {...props}
                animation={false}
                size="lg"
                fullscreen={true}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                {loading ? (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Run Instant Report - {reportMetadata.title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {reportMetadata.inputVariables.map((variable, i) =>
                                    <div className="row mb-3" key={'var_' + variable.name}>
                                        <label htmlFor="colFormLabel"
                                               className="col-sm-2 col-form-label">{variable.name} ({variable.type})</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control"
                                                   defaultValue={variable.defaultValue}
                                                   id={'var_' + variable.name} {...register(variable.name, {required: true})} />
                                        </div>
                                    </div>
                                )}
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-info mb-3">Run</button>
                                </div>
                            </form>
                            {!reportData ? (
                                <div>

                                </div>
                            ) : (
                                <div>
                                    <CSVLink data={reportData.rows} headers={reportData.columns}
                                             filename={reportMetadata.title + ".csv"}>
                                        <img className="downloadLinkIcon" alt="csv" src="/csv-icon.png"/>Download as CSV
                                    </CSVLink>

                                    {!reportDataForTable ? (
                                        <div>

                                        </div>
                                    ) : (
                                        <div className="instantReportTableWrapper">
                                            <BootstrapTable keyField={reportDataForTable.columns[0].dataField}
                                                            data={reportDataForTable.rows}
                                                            columns={reportDataForTable.columns}/>
                                        </div>
                                    )}
                                    {/*<table className="table">*/}
                                    {/*    <thead>*/}
                                    {/*    <tr>*/}
                                    {/*        {reportData.columns.map((column, i) =>*/}
                                    {/*            <th scope="col" key={'column_' + column}>{column}</th>*/}
                                    {/*        )}*/}
                                    {/*    </tr>*/}
                                    {/*    </thead>*/}
                                    {/*    <tbody>*/}
                                    {/*    {reportData.rows.map((row, i) =>*/}
                                    {/*        <tr key={'row_' + i}>*/}
                                    {/*            {row.map((cell, j) =>*/}
                                    {/*                <td key={'cell_' + i + '_' + j}>{cell}</td>*/}
                                    {/*            )}*/}
                                    {/*        </tr>*/}
                                    {/*    )}*/}
                                    {/*    </tbody>*/}
                                    {/*</table>*/}
                                </div>
                            )}
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    );
}