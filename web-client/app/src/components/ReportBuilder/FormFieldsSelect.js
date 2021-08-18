import {useState} from 'react'
import './ReportForms.css'
import FormFields from "./FormFields";

export default function FormFieldsSelect({formData}) {
    const [fieldsVisible, setFieldsVisible] = useState(false);


    const toggleFields = () => {
        setFieldsVisible(prevState => {
            return !prevState;
        });
    };

    return (
        <div className="formSelectWrapper">
            <div className="form-tree-item"
                 onClick={toggleFields}>{fieldsVisible ? '-' : '+'} {formData.name} ({formData.fields.length})
            </div>
            {fieldsVisible &&
            <FormFields fields={formData.fields} parentPath={formData.id}/>
            }
        </div>
    );
}