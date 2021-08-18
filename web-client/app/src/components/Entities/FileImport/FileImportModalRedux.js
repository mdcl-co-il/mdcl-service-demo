import "../Entities.css";
import BootstrapTable from 'react-bootstrap-table-next';
import {Modal, ProgressBar} from 'react-bootstrap'
import {FormsSvc} from '../../../services';
import {useCallback, useEffect, useReducer} from "react";
import {CSVLink} from "react-csv";
import UploadForm from "./UploadForm";
import FilePreview from "./FilePreview";


export const ACTIONS = {
    RESET: 'reset',
    LOAD_ENTITY_DATA: 'load-entity-data',
    LOAD_FILE_DATA: 'load-file-data',
    START_UPLOAD: 'start-upload',
    UPDATE_FILE_LOAD_PROGRESS: 'update-file-load-progress',
    UPDATE_PREVIEW_SELECTION: 'update-preview-selection',
    START_IMPORT: 'start-import',
    SET_DATA_TO_IMPORT: 'set-data-to-import',
    UPDATE_IMPORT_PROGRESS: 'update-import-progress',
    SET_IMPORT_COMPLETE: 'set-import-complete'
};

const initialState = () => {
    return {
        global: "loading",
        entityData: {},
        entityColumns: [],
        fileLoadProgress: {
            percent: 0,
            title: "NA"
        },
        previewData: {
            data: null,
            selectedRows: []
        },
        dataToImport: null,
        importProgress: {
            percent: 0,
            title: "NA"
        }
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.RESET:
            return initialState();
        case ACTIONS.LOAD_ENTITY_DATA:
            return {
                ...state,
                entityData: action.payload.entityData,
                entityColumns: action.payload.entityData.fields.map(field => field.name),
                global: "readyToUpload"
            };
        case ACTIONS.START_UPLOAD:
            return {
                ...state,
                global: "uploadProgress"
            }
        case ACTIONS.UPDATE_FILE_LOAD_PROGRESS:
            return {
                ...state,
                fileLoadProgress: action.payload,
                global: "uploadProgress"
            }
        case ACTIONS.LOAD_FILE_DATA:
            return {
                ...state,
                previewData: {...state.previewData, data: action.payload.tableData},
                global: "dataReady"
            }
        case ACTIONS.UPDATE_PREVIEW_SELECTION:
            return {
                ...state,
                previewData: {...state.previewData, selectedRows: action.payload.selectedRows}
            }
        case ACTIONS.START_IMPORT:
            return {
                ...state,
                importProgress: {
                    percent: 0,
                    title: "NA"
                },
                global: "importInProgress"
            }
        case ACTIONS.SET_DATA_TO_IMPORT:
            return {
                ...state,
                dataToImport: action.payload.dataToImport
            }
        case ACTIONS.UPDATE_IMPORT_PROGRESS:
            return {
                ...state,
                importProgress: action.payload,
                global: "importInProgress"
            }
        case ACTIONS.SET_IMPORT_COMPLETE:
            return {
                ...state,
                global: "importCompleted"
            }
        default:
            return state;
    }
};


export default function FileImportModalRedux(props) {
    const {data} = props;
    const {entityId} = data;
    const [state, dispatch] = useReducer(reducer, {});

    const loadEntityData = useCallback(async () => {
        dispatch({type: ACTIONS.RESET})
        const entityData = await FormsSvc.getForm(entityId);
        dispatch({type: ACTIONS.LOAD_ENTITY_DATA, payload: {entityData}})
    }, [entityId]);

    const reset = async () => {
        dispatch({type: ACTIONS.RESET});
        await loadEntityData();
    };

    const importRow = async (row) => {
        const fieldsClone = JSON.parse(JSON.stringify(state.entityData.fields));
        const sendData = fieldsClone.map(field => {
            field.value = row.hasOwnProperty(field.name) ? "" + row[field.name] : "NA";
            return field;
        });
        return await FormsSvc.fillForm(state.entityData.id, sendData);
    };

    const importData = async () => {
        dispatch({type: ACTIONS.START_IMPORT});

        const selectedRowsDataToImport = state.previewData.data.rows.filter(row => state.previewData.selectedRows.indexOf(row.index) > -1);
        dispatch({type: ACTIONS.SET_DATA_TO_IMPORT, payload: {dataToImport: selectedRowsDataToImport}});

        const rowPer = 100 / selectedRowsDataToImport.length;
        let currentPer = 0;
        let index = 0;

        for (let row of selectedRowsDataToImport) {
            currentPer = (index + 1) * rowPer;
            dispatch({
                type: ACTIONS.UPDATE_IMPORT_PROGRESS, payload: {
                    percent: currentPer,
                    title: `Importing ${index + 1} / ${selectedRowsDataToImport.length}`
                }
            });
            await importRow(row);
            index++;
        }
        dispatch({type: ACTIONS.SET_IMPORT_COMPLETE});
    };

    useEffect(() => {
        if (entityId) {
            loadEntityData()
                .then(() => {

                })
        }
    }, [entityId, loadEntityData]);

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
                {(!state.global || ["NA", "loading"].indexOf(state.global) > -1) ? (
                    <>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Loading...
                            </Modal.Title>
                        </Modal.Header>
                    </>
                ) : (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Import Data for "{state.entityData.title}"

                                <CSVLink className="forms-list-btn" data={[]}
                                         headers={state.entityData.fields.map(field => field.name)}
                                         filename={state.entityData.title + "_Entity_Template.csv"}>
                                    <button type="button" className="btn btn-sm btn-outline-dark import-top-button">
                                        Download CSV Template
                                    </button>
                                </CSVLink>

                                <button type="button" className="btn btn-sm btn-info import-top-button"
                                        disabled={state.previewData.selectedRows.length < 1} onClick={importData}>
                                    Import ({state.previewData.selectedRows.length}) selected rows
                                </button>

                                <button type="button" className="btn btn-sm btn-outline-danger import-top-button"
                                        onClick={reset}>
                                    Reset
                                </button>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {(() => {
                                switch (state.global) {
                                    case "loading":
                                        return <>
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </>
                                    case "readyToUpload":
                                        return <UploadForm dispatch={dispatch}
                                                           entityColumns={state.entityColumns}
                                                           entityData={state.entityData}/>
                                    case "uploadProgress":
                                        return <>
                                            <ProgressBar variant="info" now={state.fileLoadProgress.percent}
                                                         label={`${state.fileLoadProgress.title}`}/>
                                        </>
                                    case "dataReady":
                                        return <FilePreview dispatch={dispatch}
                                                            previewData={state.previewData}/>
                                    case "importInProgress":
                                        return <>
                                            <ProgressBar variant="success" now={state.importProgress.percent}
                                                         label={`${state.importProgress.title}`}/>
                                        </>
                                    case "importCompleted":
                                        return <>
                                            <div className="alert alert-success" role="alert">
                                                {state.dataToImport.length} Rows Imported!
                                            </div>
                                            <BootstrapTable keyField={state.previewData.data.keyField}
                                                            data={state.dataToImport}
                                                            columns={state.previewData.data.columns}/>
                                        </>
                                    default:
                                        return <>
                                        </>
                                }
                            })()}
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    );
}