import {useEffect, useState} from "react";
import {FormActionsContext} from "../../../../contexts/FormsBuilderContext";

export default function FieldTypeFormLink({data, updateCB, reset}) {
    const [formData, setFormData] = useState([]);
    const [selectedValue, setSelectedValue] = useState('NaN');
    const formActions = FormActionsContext();
    const id = 'field_' + data.id;

    const extraData = JSON.parse(data.extraData);

    useEffect(() => {
        formActions.getFormFills(extraData.formId)
            .then(fills => {
                const dataToPush = [];
                for (let fill of fills) {
                    const item = JSON.parse(fill.data);
                    // create display:
                    item.title = Object.keys(item).map(key => item[key]).join(",");
                    //////////////////
                    item.id = fill.id;
                    dataToPush.push(item);
                }
                setFormData(dataToPush);
            });
    }, [extraData.formId, formActions]);

    useEffect(() => {
        setSelectedValue("NaN")
    }, [reset]);

    const update = async () => {
        let value = document.getElementById(id).value;
        setSelectedValue(value);
        updateCB(value !== 'NaN' ? value : null);
    };

    useEffect(() => {

    });

    return (
        <div className="form-floating mb-3">
            <select className="form-select" id={id} value={selectedValue}
                    onChange={update}>
                <option value='NaN'>Please select</option>
                {formData.map((fill, i) =>
                    <option key={id + '_form_fill_' + fill.id} value={fill.id}>{fill.title}</option>
                )}
            </select>
            <label htmlFor={id}>{data.name}</label>
        </div>
    );
}