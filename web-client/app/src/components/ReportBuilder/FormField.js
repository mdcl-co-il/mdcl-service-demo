import {useState} from 'react'
import './ReportForms.css'
import FormFields from "./FormFields";
import {ReportSvc} from "../../services";

export default function FormField({fieldData, parentPath}) {
    const [fieldsVisible, setFieldsVisible] = useState(false);
    const [fieldsData, setFieldsData] = useState([]);

    const subFormId = fieldData.hasOwnProperty('subFormId') ? fieldData.subFormId : 0;
    const fieldType = fieldData.type;
    const fieldPath = [parentPath, fieldData.path];
    const extendableTypes = [10, 3, 17];
    let isExtendable = false;

    if (extendableTypes.indexOf(fieldType) > -1 && subFormId && subFormId !== 0) {
        fieldPath.push(subFormId);
        isExtendable = true;
    }

    const currentPath = fieldPath.join('___');
    const toggleFields = async () => {
        if (fieldData.type === 3)
            return;
        if (!fieldsVisible && fieldsData.length === 0) {
            const fields = await ReportSvc.getFormFields(subFormId);
            setFieldsData(fields);
        }
        setFieldsVisible(prevState => {
            return !prevState;
        });
    };

    const dragField = (e) => {
        e.dataTransfer.setData("fieldPath", currentPath);
        e.dataTransfer.setData("fieldName", fieldData.name);
        e.dataTransfer.setData("fieldType", fieldData.type);
    };

    return (
        <>
            {(isExtendable)
                ? (
                    <>
                        <div onClick={toggleFields}

                             className={'fieldName form-tree-item ' + (fieldData.type === 3 ? 'disabled' : '')}>{fieldsVisible ? '-' : '+'} {fieldData.name} {fieldData.type === 3 ? '(disabled)' : ''}</div>
                        {fieldsVisible &&
                        <FormFields fields={fieldsData} parentPath={currentPath}/>
                        }
                    </>
                )
                : (
                    <div data-path={currentPath} className="fieldName selectableField form-tree-item"
                         draggable="true" onDragStart={dragField}>{fieldData.name}</div>
                )
            }
        </>
    );
}