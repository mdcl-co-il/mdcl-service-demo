import FieldTypeText from "./FillTypes/FieldTypeText";
import FieldTypeNumber from "./FillTypes/FieldTypeNumber";
import FieldTypeFormLink from "./FillTypes/FieldTypeFormLink";
import FieldTypeDate from "./FillTypes/FieldTypeDate";

export default function FormFillField({data, updateCB, reset}) {

    const update = async (value) => {
        updateCB(data.id, value);
    };

    switch (data.type) {
        case 1:
            return <FieldTypeText data={data} updateCB={update} reset={reset}/>
        case 2:
            return <FieldTypeNumber data={data} updateCB={update} reset={reset}/>
        case 3:
            return <FieldTypeDate data={data} updateCB={update} reset={reset}/>
        case 6:
            return <FieldTypeFormLink data={data} updateCB={update} reset={reset}/>
        default:
            return (
                <div className="form-floating mb-3">
                    {data.name} has type {data.type}, but this type is not implemented yet!
                </div>
            );
    }
}