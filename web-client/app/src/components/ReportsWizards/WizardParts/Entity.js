import '../Wizards.css';
import {EntityReportListContext} from "../../../contexts/ReportsWizardsContext";
import {useEffect, useRef, useState} from "react";
import Editor from "@monaco-editor/react";

export default function WizardEntity(props) {
    const editorRef = useRef(null);
    const [entitySet, setEntitySet] = useState(false);
    const [entity, setEntity] = useState(null);
    const entities = EntityReportListContext();

    const handleSelectionChange = async (element) => {
        if (element.target.value !== "0") {
            setEntity(entities.filter(entity => entity.id === element.target.value)[0]);
            setEntitySet(true);
        } else {
            setEntity(null);
            setEntitySet(false);
        }
    };

    const setEditorValue = () => {
        if (!editorRef.current) {
            return;
        }
        let editorValue = "";

        if (entitySet && entity) {
            const vars = [];
            entity.inputVariables.forEach(inVar => {
                editorValue += `const ${inVar.name} = ${inVar.defaultValue};\n`;
                vars.push(inVar.name);
            });
            editorValue += `const entityData = getEntityReport('${entity.id}'${vars.length > 0 ? ", " : ""}${vars.join(", ")});\n`
        }
        editorRef.current.setValue(editorValue);
        handleEditorChanged(editorValue);
    }

    const editorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        setEditorValue();
    };

    const handleEditorChanged = (value) => {
        props.data.content = value;
    };


    useEffect(async () => {
        setEditorValue();
    }, [entity]);

    return (
        <div>
            <select className="form-select form-select-sm" aria-label=".form-select-sm"
                    onChange={handleSelectionChange}>
                <option>Select entity</option>
                {entities.map((entity, i) =>
                    <option key={'entity_' + entity.id} value={entity.id}>{entity.title}</option>
                )}
            </select>

            {entitySet ? (
                <Editor
                    height="10vh"
                    defaultLanguage="javascript"
                    onMount={editorDidMount}
                    onChange={handleEditorChanged}
                />
            ) : (
                <></>
            )}
        </div>
    )
}