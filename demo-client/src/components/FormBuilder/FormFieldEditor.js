import {FieldTypesContext} from "../../contexts/FormsBuilderContext";

export default function FormFieldEditor({data}) {

    const types = FieldTypesContext();

    console.log(types);

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <form >
                        <div className="mb-3 row">
                            <label htmlFor={'fieldName_' + data.id} className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id={'fieldName_' + data.id} defaultValue={data.name} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor={'fieldType_' + data.id} className="col-sm-2 col-form-label">Type</label>
                            <div className="col-sm-10">
                                <select className="form-select" aria-label="Default select example" id={'fieldType_' + data.id}>
                                    {types.map((type, i) =>
                                        <option key={'type_' + type.id} value="1">{type.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}