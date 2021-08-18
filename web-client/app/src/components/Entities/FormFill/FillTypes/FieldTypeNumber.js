import {useEffect} from "react";

export default function FieldTypeNumber({data, updateCB, reset}) {
    const id = 'field_' + data.id;

    const update = async () => {
        updateCB(document.getElementById(id).value);
    };

    useEffect(() => {
        document.getElementById(id).addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        });
    });

    useEffect(() => {
        document.getElementById(id).value = "";
    }, [reset, id]);

    return (
        <div className="form-floating mb-3">
            <input type="number" className="form-control" id={id}
                   onChange={update} onBlur={update}/>
            <label htmlFor={id}>{data.name}</label>
        </div>
    );
}