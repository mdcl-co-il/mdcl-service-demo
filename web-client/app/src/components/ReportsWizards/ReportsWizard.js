import './Wizards.css';
import {useRef, useState} from "react";
import {UtilsSvc, WizardsSvc} from "../../services";
import Editor from "@monaco-editor/react";
import {Play, Table} from "react-bootstrap-icons";
import AddEntityToWizardModal from "./WizardParts/AddEntityToWizardModal";
import {WizardActionsContext, WizardDataContext} from "../../contexts/ReportsWizardsContext";
import {CSVLink} from "react-csv";

export default function ReportsWizard() {
    const wizard = WizardDataContext();
    const wizardActions = WizardActionsContext();
    const editorRef = useRef(null);
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    const [addEntityModalActive, setAddEntityModalActive] = useState(false);
    const [lastEditorLine, setLastEditorLine] = useState(0);
    const [parseError, setParseError] = useState(null);
    const [editorHeight, setEditorHeight] = useState("70vh");
    const [runData, setRunData] = useState(null);


    const editorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        editor.onDidChangeCursorPosition((e) => {
            setLastEditorLine(e.position.lineNumber);
        });
    };

    const addCodeBlock = (codeAsText, line) => {
        let newCodeArray = [line, 0];
        let lines = editorRef.current.getValue().split("\n");
        const codeAsTextLines = codeAsText.split("\n");
        newCodeArray = newCodeArray.concat(codeAsTextLines);
        Array.prototype.splice.apply(lines, newCodeArray);
        editorRef.current.setValue(lines.join("\n"));
        setLastEditorLine(line + codeAsTextLines.length + 1);
    };

    const openAddEntityModal = () => {
        setAddEntityModalActive(true);
    };

    const addEntity = async (entity) => {
        setAddEntityModalActive(false);
        let editorValue = `// Entity '${entity.title}' import\n`;
        const vars = [];
        entity.inputVariables.forEach(inVar => {
            editorValue += `const ${inVar.name} = ${inVar.defaultValue};\n`;
            vars.push(inVar.name);
        });
        editorValue += `const entityData = await getEntityReport('${entity.id}'${vars.length > 0 ? ", " : ""}${vars.join(", ")});`;
        addCodeBlock(editorValue, lastEditorLine);
    };

    const play = async () => {
        let codeAsText = editorRef.current.getValue();
        UtilsSvc.checkCodeValidity(codeAsText);
        try {
            const response = await WizardsSvc.runWizard(wizard.id);
            if (response) {
                response.logs.map(item => {
                    console.log(JSON.parse(item));
                    return item;
                });
                setEditorHeight("40vh");
                setRunData(response.data);
            }
        } catch (e) {
            console.error(e)
        }
    };

    const handleCodeChange = async (e) => {
        let codeAsText = editorRef.current.getValue();
        const parseErr = UtilsSvc.checkCodeValidity(codeAsText)
        if (parseErr) {
            setParseError(parseErr);
        } else {
            setParseError(null);
        }
        await updateWizard({wizardCode: codeAsText});
    }

    const updateWizard = async (data) => {
        await wizardActions.updateWizard(wizard.id, data);
    };

    const updateWizardTitle = async (e) => {
        await updateWizard({title: e.target.value});
    };

    return (
        <>
            <div className="card wizardEditor">
                <div className="card-body">
                    <h5 className="card-title">
                        <label htmlFor="formTitle" className="form-label">Title</label>
                        <input type="text" className="form-control" id="formTitle"
                               defaultValue={wizard.title} onBlur={updateWizardTitle}/>
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={openAddEntityModal}>
                                <span className="btn-label">
                                    <Table/>
                                </span>
                                Add Entity
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={play}>
                                <span className="btn-label">
                                    <Play/>
                                </span>
                                Play
                            </button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button"
                                    className={"btn " + (editorTheme === 'vs-dark' ? "btn-dark" : "btn-outline-secondary")}
                                    onClick={() => setEditorTheme('vs-dark')}>
                                Dark Theme
                            </button>
                            <button type="button"
                                    className={"btn " + (editorTheme === 'light' ? "btn-dark" : "btn-outline-secondary")}
                                    onClick={() => setEditorTheme('light')}>
                                Light Theme
                            </button>
                        </div>
                    </h6>
                    <div id="codeCanvas">
                        <Editor
                            height={editorHeight}
                            defaultLanguage="javascript"
                            onMount={editorDidMount}
                            theme={editorTheme}
                            onChange={handleCodeChange}
                            defaultValue={wizard.wizardCode}
                        />
                    </div>
                    <div id="parseError">
                        {!parseError ? (
                            <>
                            </>
                        ) : (
                            <div>
                                {parseError.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                {!runData ? (
                    <div>

                    </div>
                ) : (
                    <div>
                        <CSVLink data={runData.rows} headers={runData.columns} filename={wizard.title + ".csv"}>
                            <img className="downloadLinkIcon" alt="csv" src="/csv-icon.png"/>Download as CSV
                        </CSVLink>
                        <table className="table">
                            <thead>
                            <tr>
                                {runData.columns.map((column, i) =>
                                    <th scope="col" key={'column_' + column}>{column}</th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {runData.rows.map((row, i) =>
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
            <div>
                <AddEntityToWizardModal
                    show={addEntityModalActive}
                    onHide={() => setAddEntityModalActive(false)}
                    addEntity={addEntity}/>
            </div>

        </>
    )
}