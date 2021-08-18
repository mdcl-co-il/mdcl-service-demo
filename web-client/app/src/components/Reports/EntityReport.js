import './Reports.css';
import {EntityReportDataContext, FormActionsContext, FormDataContext} from "../../contexts/FormsBuilderContext";
import {createRef, useCallback, useEffect, useReducer, useRef} from "react";
import {UtilsSvc} from "../../services";
import {useHistory, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import Editor from "@monaco-editor/react";
import {Accordion} from "react-bootstrap";

export const ACTIONS = {
    SET_OPTIONAL_FIELDS: 'set-optional-fields',
    SET_REPORT_DATA: 'set-report-data',
    ADD_FIELD_REF: 'add-field-ref'
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_OPTIONAL_FIELDS:
            return {
                ...state,
                optionalFields: action.payload.optionalFields
            }
        case ACTIONS.SET_REPORT_DATA:
            return {
                ...state,
                reportData: action.payload.reportData
            }
        case ACTIONS.ADD_FIELD_REF:
            const newRef = {};
            newRef[action.payload.fieldId] = action.payload.ref;
            return {
                ...state,
                fieldsRefs: Object.assign(state.fieldsRefs, newRef)
            }
        default:
            return state;
    }
};

export default function EntityReport() {
    const history = useHistory();
    let {mode} = useParams();

    const [state, dispatch] = useReducer(reducer, {
        optionalFields: [],
        reportData: null,
        fieldsRefs: {}
    });

    const filterEditorRef = useRef(null);
    const inVarEditorRef = useRef(null);
    const formData = FormDataContext();
    const fromActions = FormActionsContext();
    const report = EntityReportDataContext();
    const {register, handleSubmit, formState: {errors}} = useForm();

    const handleFilterEditorDidMount = (editor, monaco) => {
        filterEditorRef.current = editor;
        if (mode && mode === "edit" && report.findObject !== "") {
            editor.setValue(report.findObject);
            setTimeout(() => {
                editor.trigger('anyString', 'editor.action.formatDocument');
            }, 100)
        }
    };

    const handleInVarEditorDidMount = (editor, monaco) => {
        inVarEditorRef.current = editor;
        if (mode && mode === "edit" && report.inputVariablesText !== "") {
            editor.setValue(report.inputVariablesText);
            setTimeout(() => {
                editor.trigger('anyString', 'editor.action.formatDocument');
            }, 100);
        }
    };

    const onSubmit = async (data) => {
        report.title = data.title;
        finalizeReportData();
        const newId = await fromActions.saveReport(report);
        history.push("/entityReport/edit/" + report.baseForm + "/" + newId);
    };

    const handleFieldSelection = (e) => {
        updateVisibleFields();
    };

    const setupFindTextBoxBehavior = (cardId) => {
        if (document.getElementById(cardId)) {
            document.getElementById(cardId).style.borderColor = "";
        }
    };

    const updateInVar = () => {
        let value = inVarEditorRef.current.getValue();
        report.inputVariables = UtilsSvc.extractArgumentsFromTextCode(value);
        report.inputVariablesText = value;
    };

    const updateFindText = (cardId) => {
        report.findObject = filterEditorRef.current.getValue();
    };

    const updateVisibleFields = () => {
        report.visibleFields = [];
        const checked = document.querySelectorAll('input.optional-field:checked');
        checked.forEach(chb => {
            report.visibleFields.push(state.optionalFields.find(item => {
                const spl = chb.id.split("_");
                return item.id === spl[0] && item.linkFieldId + "" === spl[1];
            }));
        });
    };

    const finalizeReportData = () => {
        updateVisibleFields();
        updateFindText('filter-card');
        updateInVar();
        report.allFields = state.optionalFields;
    }

    const runReport = async () => {
        finalizeReportData();
        const reportData = await fromActions.runReport(report);
        dispatch({type: ACTIONS.SET_REPORT_DATA, payload: {reportData}});
    };

    const loadExistsReport = useCallback(() => {
        if (report.visibleFields && Array.isArray(report.visibleFields) && report.visibleFields.length > 0 && Object.keys(state.fieldsRefs).length > 0) {
            report.visibleFields.forEach(field => {
                state.fieldsRefs[field.id + "_" + field.linkFieldId].current.checked = true;
            });
        }
    }, [report.visibleFields, state.fieldsRefs]);

    const fetchData = useCallback(async () => {
        if (fromActions.getReportFieldsList) {
            const fieldList = await fromActions.getReportFieldsList(formData.id);
            fieldList.forEach(field => {
                dispatch({
                    type: ACTIONS.ADD_FIELD_REF, payload: {
                        fieldId: field.id + "_" + field.linkFieldId,
                        ref: createRef()
                    }
                })
            });
            dispatch({type: ACTIONS.SET_OPTIONAL_FIELDS, payload: {optionalFields: fieldList}});
        }
        setupFindTextBoxBehavior('filter-card');
        if (mode && mode === "edit") {
            loadExistsReport();
        }
    }, [fromActions, formData.id, mode, loadExistsReport]);


    useEffect(() => {
        fetchData()
            .then(() => {

            });
    }, [fetchData]);

    return (
        <div>
            <div className="card form-fill-card">
                <div className="card-body">
                    {mode === "new" ? (
                        <h5 className="card-title">Build report based on '{formData.title}' entity</h5>
                    ) : (
                        <></>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary mb-3">Save Entity Report</button>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="formTitle" className="form-label">Report Name</label>
                            <input type="text" className="form-control" id="reportTitle"
                                   defaultValue={report.title} {...register("title", {required: true})}/>
                            {errors.title && <span>This field is required</span>}
                        </div>
                    </form>
                </div>
            </div>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Visible fields</Accordion.Header>
                    <Accordion.Body>
                        {state.optionalFields.map((field, i) =>
                            <div className="form-check form-switch" key={field.id + "_" + field.linkFieldId}>
                                <input className="form-check-input optional-field" type="checkbox"
                                       id={field.id + "_" + field.linkFieldId}
                                       onChange={handleFieldSelection}
                                       ref={state.fieldsRefs[field.id + "_" + field.linkFieldId]}/>
                                <label className="form-check-label" htmlFor={field.id + "_" + field.linkFieldId}>
                                    {field.name}
                                </label>
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Input Variables</Accordion.Header>
                    <Accordion.Body>
                        <label className="form-label">
                            Add input variables here
                        </label>
                        <Editor
                            height="20vh"
                            defaultLanguage="javascript"
                            theme="vs-dark"
                            defaultValue=''
                            onMount={handleInVarEditorDidMount}
                        />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header><label id="filter-card">Filter</label></Accordion.Header>
                    <Accordion.Body>
                        <label htmlFor="findText" className="form-label">
                            Filter (<a href="https://github.com/techfort/LokiJS/wiki/Query-Examples"
                                       target="_blank" rel="noreferrer">LokiJs find syntax</a>)
                            Add your filter here <br/>
                            do not change anything outside filter curly brackets <br/>
                        </label>
                        <div id="findText">
                            <Editor
                                height="20vh"
                                defaultLanguage="javascript"
                                theme="vs-dark"
                                defaultValue='let filter = {
     "field-name": {"$ne": 42}
}'
                                onMount={handleFilterEditorDidMount}
                            />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div className="card form-fill-card">
                <div className="card-body">
                    <button type="button" className="btn btn-dark" onClick={runReport}>Run Report</button>
                    {!state.reportData ? (
                        <div>
                            No data..
                        </div>
                    ) : (
                        <div>
                            <table className="table">
                                <thead>
                                <tr>
                                    {state.reportData.columns.map((column, i) =>
                                        <th scope="col" key={'column_' + column}>{column}</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {state.reportData.rows.map((row, i) =>
                                    <tr key={'row_' + i}>
                                        {row.map((cell, j) =>
                                            <td key={'cell_' + i + '_' + j}>{cell}</td>
                                        )}
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}