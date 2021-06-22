import './FormBuilder.css'
import {FormDataContext, FormFieldsDataContext} from "../../contexts/FormsBuilderContext";
import {useForm} from "react-hook-form";
import {FormsSvc, UtilsSvc} from "../../services";
import {Link} from "react-router-dom";
import FormFieldEditor from "./FormFieldEditor";

export default function FormBuilder() {
    const formData = FormDataContext();
    const formFieldsData = FormFieldsDataContext();
    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        const res = await FormsSvc.updateForm(formData.id, data);
        console.log("Form saved!");
    };

    const onFieldSubmit = async (data) => {

    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary mb-3">Save Form Metadata</button>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="formTitle" className="form-label">Form Title</label>
                            <input type="text" className="form-control" id="formTitle"
                                   defaultValue={formData.title} {...register("title", {required: true})}/>
                            {errors.title && <span>This field is required</span>}
                        </div>
                        <div className="col-auto">
                            <label htmlFor="formDescription" className="form-label">Form Description</label>
                            <textarea className="form-control" id="formDescription" rows="3"
                                      defaultValue={formData.description} {...register("description")} />
                        </div>
                    </form>
                </div>
            </div>


            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Form Fields <button type="button" className="btn btn-primary btn-sm">Add
                        Form Field + </button></h5>
                    {formFieldsData.map((field, i) =>
                        <FormFieldEditor key={'field_' + field.id} data={field}/>
                    )}
                </div>
            </div>
        </>
    );
}