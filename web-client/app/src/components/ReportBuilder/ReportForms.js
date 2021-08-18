import FormFieldsSelect from "./FormFieldsSelect";
import './ReportForms.css'

export default function ReportForms({forms}) {

    return (
        <div className="reportFormsWrapper">
            {forms.map(form => <FormFieldsSelect key={form.id} formData={form}/>)}
        </div>
    );
}