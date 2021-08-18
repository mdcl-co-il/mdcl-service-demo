import {useEffect} from "react";

export default function FieldTypeDate({data, updateCB, reset}) {
    const id = 'field_' + data.id;

    const update = async () => {
        updateCB(document.getElementById(id).value);
    };

    useEffect(() => {
        document.getElementById(id).value = "";
    }, [reset, id]);

    return (
        <div className="form-floating mb-3">
            <input type="date" className="form-control" id={id}
                   onChange={update} onBlur={update}/>
            <label htmlFor={id}>{data.name}</label>
        </div>
    );
}