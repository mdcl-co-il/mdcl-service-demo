import './ReportForms.css'
import FormField from "./FormField";

export default function FormFields({fields, parentPath}) {
    return (
        <div style={{'marginLeft': '20px'}}>
            {fields.map(field => <FormField key={parentPath + field.path} fieldData={field} parentPath={parentPath}/>)}
        </div>
    );
}