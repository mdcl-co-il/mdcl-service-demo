import '../Entities.css'
import {FormActionsContext, FormDataContext, FormFieldsDataContext} from "../../../contexts/FormsBuilderContext";
import {useForm} from "react-hook-form";
import EntityFieldEditor from "./EntityFieldEditor";

export default function EntityBuilder() {
    const formData = FormDataContext();
    const formFieldsData = FormFieldsDataContext();
    const formActions = FormActionsContext();
    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        await formActions.updateForm(data);
        console.log("Form saved!");
    };

    const addFormField = async () => {
        await formActions.addFormField();
    };

    return (
        <>
            <div className="card form-build-card">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-auto">
                            <label htmlFor="formTitle" className="form-label">Entity Name</label>
                            <input type="text" className="form-control" id="formTitle"
                                   defaultValue={formData.title} {...register("title", {required: true})}/>
                            {errors.title && <span>This field is required</span>}
                        </div>
                        <br/>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary mb-3">Save Entity Name</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="card form-build-card">
                <div className="card-body">
                    <h5 className="card-title">Key</h5>
                    {formFieldsData.filter(field => field.isKey === true).map((field, i) =>
                        <EntityFieldEditor key={'field_' + field.id} data={field}/>
                    )}
                </div>
            </div>

            <div className="card form-build-card">
                <div className="card-body">
                    <h5 className="card-title">Fields <button type="button" className="btn btn-primary btn-sm"
                                                              onClick={addFormField}>Add
                        Field + </button></h5>
                    {formFieldsData.filter(field => field.isKey !== true).map((field, i) =>
                        <EntityFieldEditor key={'field_' + field.id} data={field}/>
                    )}
                </div>
            </div>
        </>
    );
}