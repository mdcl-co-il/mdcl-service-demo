import {
    ReportColumnsContext,
    ReportColumnUpdateContext,
    ReportResultsContext
} from "../../contexts/ReportBuilderContext";
import {Utils} from '@mdcl-co-il/common';

export default function ReportColumns() {
    const columnsLimit = 100;
    const columns = ReportColumnsContext();
    const updateReportColumns = ReportColumnUpdateContext();
    const results = ReportResultsContext();

    const allowDrop = (e) => {
        e.preventDefault();
    }

    const Drop = (e) => {
        e.preventDefault();
        const fieldPath = e.dataTransfer.getData("fieldPath");
        const fieldName = e.dataTransfer.getData("fieldName");
        const fieldType = e.dataTransfer.getData("fieldType");

        if (columns.hasOwnProperty(fieldPath)) {
            console.error(`${fieldName} already a column!`);
        } else if (Object.keys(columns).length >= columnsLimit) {
            console.error(`Max number of columns (${columnsLimit})`);
        } else {
            const newItem = {}
            newItem[fieldPath] = {
                object_path: Utils.getValuePathFromColPath(fieldPath),
                path: fieldPath,
                name: fieldName,
                type: fieldType
            }
            updateReportColumns.call(null, {...newItem, ...columns});
        }
    };

    const resultTextNorm = (columnDef, row, objectPath) => {
        if (!row.hasOwnProperty(objectPath)) {
            return 'N/A';
        }
        const value = row[objectPath];
        switch (parseInt(columnDef.type)) {
            case 4:
                return Utils.formatDateString(value);
            default:
                return value;
        }
    };

    return (
        <div className="card-body row columns-wrapper" onDrop={Drop} onDragOver={allowDrop}>
            {Object.keys(columns).length === 0 ? (
                <>
                    Drag a column
                </>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                {Object.keys(columns).map(columnKey => <th scope="col"
                                                                           key={columns[columnKey].path}>{columns[columnKey].name}</th>)}
                            </tr>
                            </thead>

                            <tbody>
                            {results.map((row, i) =>
                                <tr key={'result_row_' + i}>
                                    {Object.keys(columns).map(columnKey => <td
                                        key={'result_row_' + i + '_' + columns[columnKey].path}>{resultTextNorm(columns[columnKey], row, columns[columnKey].object_path)}</td>)}
                                </tr>
                            )}

                            </tbody>
                        </table>


                    </div>

                </>
            )}
        </div>
    );
}