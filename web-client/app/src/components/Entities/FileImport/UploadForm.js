import CSVReader from "react-csv-reader";
import {FormsSvc, UtilsSvc} from "../../../services";
import {useMemo} from "react";
import {ACTIONS} from "./FileImportModalRedux";

function UploadForm({dispatch, entityColumns, entityData}) {
    let rowsLoadThrottleTimeMS = 50;
    let uniqueKeysList = [];

    const dataColumns = useMemo(() => {
        const id_columns = [
            {
                dataField: "generated_id",
                text: "generated_id",
                hidden: true
            }
        ];
        const entityTableColumns = entityColumns.map(colName => {
            return {
                dataField: colName,
                text: colName,
                sort: true
            }
        });
        const validationColumns = [
            {
                dataField: "valid",
                text: "Is Valid",
                sort: true
            },
            {
                dataField: "validationMessage",
                text: "Validation Msg",
                sort: false
            }
        ];
        return [...id_columns, ...entityTableColumns, ...validationColumns];
    }, [entityColumns]);

    const entityColumnsSign = useMemo(() => {
        if (entityData && entityData.fields) {
            return entityData.fields.map(field => field.name).sort().join("-");
        }
    }, [entityData]);

    const onFileLoaded = async (data) => {
        uniqueKeysList = [];
        const tableData = {
            keyField: "generated_id",
            columns: dataColumns,
            rows: []
        };
        dispatch({type: ACTIONS.START_UPLOAD});

        if (data.length > 0) {
            const rowPer = 100 / data.length;
            let currentPer = 0;
            let index = 0;
            for (let row of data) {
                const result = await checkRow(row);
                result.generated_id = UtilsSvc.generateId();
                result.index = index;
                currentPer = (index + 1) * rowPer;
                if (currentPer > 100) {
                    currentPer = 100;
                }
                dispatch({
                    type: ACTIONS.UPDATE_FILE_LOAD_PROGRESS, payload: {
                        percent: currentPer,
                        title: `Processing ${index + 1} / ${data.length}`
                    }
                })
                tableData.rows.push(result);
                index++;
            }
            dispatch({type: ACTIONS.LOAD_FILE_DATA, payload: {tableData}});
        }
    };

    const onError = (error) => {
        console.log("error", error);
    };

    const triggerUpload = () => {
        document.getElementById("entityUploadInput").click();
    };

    const checkRow = async (row) => {
        await sleep(rowsLoadThrottleTimeMS);
        const rowClone = JSON.parse(JSON.stringify(row));
        const rowSignature = Object.keys(row).sort().join("-");
        rowClone.valid = true;
        // check columns match
        if (rowSignature !== entityColumnsSign) {
            rowClone.valid = false;
            rowClone.validationMessage = "Row item isn't match entity columns";
        }

        // check required fields exists with values
        for (let key in row) {
            const fieldDef = entityData.fields.filter(field => field.name === key);
            if (fieldDef.length < 1) {
                rowClone.valid = false;
                rowClone.validationMessage = `"${key}" is not a valid column`;
            } else {
                const def = fieldDef[0];
                if ((def.required || def.isKey) && (!row[key] || row[key] === "")) {
                    rowClone.valid = false;
                    rowClone.validationMessage = `"${key}" has no value for required field`;
                } else if (def.isKey) {
                    // check unique
                    if (uniqueKeysList.indexOf(row[key]) > -1) {
                        rowClone.valid = false;
                        rowClone.validationMessage = `"${key}:${row[key]}" is a key, but more than 1 exists with the same value`;
                    } else {
                        if (!await FormsSvc.isKeyUnique(def.id, "" + row[key])) {
                            rowClone.valid = false;
                            rowClone.validationMessage = `"${key}:${row[key]}" already taken`;
                        }
                        uniqueKeysList.push(row[key]);
                    }
                } else if (def.type === 6) {
                    // check key exists in form link and replace value
                    const {formId} = JSON.parse(def.extraData);
                    const fillId = await FormsSvc.getFillIdFromKey(formId, "" + row[key]);
                    const form = await FormsSvc.getForm(formId);
                    if (fillId === "NA") {
                        rowClone.valid = false;
                        rowClone.validationMessage = `"${row[key]}" dose not match any item on "${form.title}" entity`;
                    } else {
                        rowClone[key] = fillId;
                    }
                }
            }
        }
        return rowClone;
    };

    const sleep = async (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time);
        });
    };


    return (
        <>
            <CSVReader
                cssClass="csv-reader-input"
                onFileLoaded={onFileLoaded}
                onError={onError}
                parserOptions={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true
                }}
                inputId="entityUploadInput"
                inputStyle={{display: 'none'}}
            />
            <button type="button" className="btn btn-sm btn-outline-dark"
                    onClick={triggerUpload}>
                Upload Your CSV File
            </button>
        </>
    );
}

export default UploadForm;
