import '../Entities.css'
import {FormActionsContext, FormDataContext, FormFieldsDataContext} from "../../../contexts/FormsBuilderContext";
import FormFillField from "./FormFillField";
import {useHistory} from "react-router-dom";
import {useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import AlertModal from "../../AlertModal";
import {FormsSvc} from "../../../services";

export default function FormFill() {
    const history = useHistory();
    const formData = FormDataContext();
    const formFieldsData = FormFieldsDataContext();
    const formActions = FormActionsContext();
    const [resetForm, doResetForm] = useState(0);
    const [showFormFillSaved, setShowFormFillSaved] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertModalCtx, setAlertModalCtx] = useState({});

    const onSubmit = async (event, closeAfter = false) => {
        event.preventDefault();
        const isValid = await validateForm();
        formActions.setFormFieldsData(formFieldsData);
        if (isValid) {
            await formActions.fillForm(formData.id, formFieldsData);
            setShowFormFillSaved();
            if (closeAfter) {
                history.push("/entitiesHome");
            } else {
                doResetForm(prev => prev + 1);
                history.push("/formFill/" + formData.id);
            }
        } else {
            const alertModalCtx = {
                title: `Form is not valid`,
                message: <>
                    Please fix next field(s):
                    {formFieldsData.filter(field => !field.valid).map((field, i) =>
                        <div key={"field_" + field.name}> {field.name}: {field.validityMessage}</div>
                    )}
                </>,
                confirm: async () => {
                    setShowAlertModal(false);
                }
            };
            setAlertModalCtx(alertModalCtx);
            setShowAlertModal(true);
        }
    };

    const submitAndClose = async (e) => {
        await onSubmit(e, true);
    };

    const fieldUpdated = (key, value) => {
        const item = formFieldsData.filter(field => field.id === key)[0];
        item.value = value;
    };

    const validateForm = async () => {
        let valid = true;
        for (let item of formFieldsData) {
            item.validityMessage = "";
            item.valid = true;

            if (item.required && (!item.value || item.value === "")) {
                item.valid = false;
                item.validityMessage = "required item can't be empty";
                valid = false;
            } else if (item.isKey) {
                if (!item.value || item.value === "") {
                    item.valid = false;
                    item.validityMessage = "key item can't be empty";
                    valid = false;
                } else {
                    // check unique
                    const isUnique = await FormsSvc.isKeyUnique(item.id, item.value);
                    if (isUnique) {
                        item.valid = true;
                    } else {
                        item.validityMessage = `key item value "${item.value}" already taken`;
                        item.valid = false;
                        valid = false;
                    }
                }
            }
        }
        return valid;
    };

    return (
        <>
            <AlertModal
                show={showAlertModal}
                ctx={alertModalCtx}
            >
            </AlertModal>
            <ToastContainer className="p-3" position="bottom-end">
                <Toast onClose={() => setShowFormFillSaved(false)} show={showFormFillSaved} delay={5000} autohide>
                    <Toast.Header closeButton={true}>
                        <strong className="me-auto">Form fill saved!</strong>
                        {/*<small>Form fill saved!</small>*/}
                    </Toast.Header>
                    {/*<Toast.Body>Form fill saved!</Toast.Body>*/}
                </Toast>
            </ToastContainer>
            <div className="card form-fill-card">
                <div className="card-body">
                    <h5 className="card-title">{formData.title}
                    </h5>
                    <p className="card-text">{formData.description}</p>
                    <form onSubmit={onSubmit}>
                        {formFieldsData.map((field, i) =>
                            <FormFillField key={'form_fill_field_' + field.id} data={field} updateCB={fieldUpdated}
                                           reset={resetForm}/>
                        )}

                        <button type="submit" className="btn btn-primary mb-3 submit-btn">Submit And Fill More</button>
                        <button type="button" className="btn btn-dark mb-3 submit-btn" onClick={submitAndClose}>Submit
                            And Close
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}