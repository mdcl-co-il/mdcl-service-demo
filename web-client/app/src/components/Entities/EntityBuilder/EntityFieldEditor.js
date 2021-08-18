import {FieldTypesContext, FormActionsContext, FormsListContext} from "../../../contexts/FormsBuilderContext";
import EntitySelect from "./EntitySelect";

export default function EntityFieldEditor({data}) {
    const types = FieldTypesContext();
    const actions = FormActionsContext();
    const forms_list = FormsListContext();

    const extraData = data.hasOwnProperty("extraData") ? JSON.parse(data.extraData) : {};

    const update = async () => {
        const dataToSend = JSON.parse(JSON.stringify(data));
        dataToSend.type = parseInt(document.getElementById(`fieldType_${data.id}`).value);
        dataToSend.name = document.getElementById(`fieldName_${data.id}`).value;
        delete dataToSend.id;
        await actions.updateFormField(data.id, dataToSend);
    };

    const deleteField = async () => {
        await actions.deleteFormField(data.id);
    };

    const updateFormSelection = async (extraData) => {
        data.extraData = JSON.stringify(extraData);
        setTimeout(async () => {
            await update();
        }, 100);
    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="row">
                            <div className="col-auto">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id={'fieldName_' + data.id}
                                           defaultValue={data.name} onBlur={update}/>
                                    <label htmlFor={'fieldName_' + data.id}>Field Name</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="form-floating mb-3">
                                    <select className="form-select" id={'fieldType_' + data.id} value={data.type}
                                            onChange={update} disabled={data.isKey}>
                                        {types.map((type, i) =>
                                            <option key={'type_' + type.id} value={type.id}>{type.name}</option>
                                        )}
                                    </select>
                                    <label htmlFor={'fieldType_' + data.id}>Field Type</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                {data.type === 6 &&
                                <EntitySelect data={forms_list} extraData={extraData} onChangeCB={updateFormSelection}/>
                                }
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-danger btn-sm" onClick={deleteField}
                                        disabled={data.isKey}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}