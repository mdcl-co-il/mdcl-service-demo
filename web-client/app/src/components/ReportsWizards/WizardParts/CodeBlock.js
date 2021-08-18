import '../Wizards.css';
import Editor from "@monaco-editor/react";
import {useRef, useState} from "react";

export default function WizardCodeBlock() {
    const editorRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState('5em');


    const editorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        editor.onDidChangeModelContent(() => {
            const lines = editorRef.current.getValue().split("\n").length;
            if (lines > 5) {
                setEditorHeight((lines) + 'em')
            } else {
                setEditorHeight('5em')
            }

        });
    };
    return (
        <div>
            <Editor
                height={editorHeight}
                defaultLanguage="javascript"
                onMount={editorDidMount}
            />
        </div>
    )
}