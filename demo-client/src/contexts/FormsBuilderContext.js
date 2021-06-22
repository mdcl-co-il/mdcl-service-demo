import {createContext, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {FormsSvc} from "../services";

const FormDataCtx = createContext({});

export function FormDataContext() {
    return useContext(FormDataCtx);
}

const FormFieldsDataCtx = createContext([]);

export function FormFieldsDataContext() {
    return useContext(FormFieldsDataCtx);
}

const FieldTypesCtx = createContext([]);

export function FieldTypesContext() {
    return useContext(FieldTypesCtx);
}

export function FormsProvider({children}) {
    let {form_id} = useParams();
    const [formData, setFormData] = useState({});
    const [formFieldsData, setFormFieldsData] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadForm = async () => {
            setLoading(true);
            const formData = await FormsSvc.getForm(form_id);
            setFormFieldsData(formData.fields);
            delete formData.field;
            setFormData(formData);
            const fieldTypes = await FormsSvc.loadFieldTypes();
            setFieldTypes(fieldTypes);
            setLoading(false);
        };
        loadForm();
        return () => {
        };
    }, [form_id]);
    return (
        <>
            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <>
                    <FormDataCtx.Provider value={formData}>
                        <FormFieldsDataCtx.Provider value={formFieldsData}>
                            <FieldTypesCtx.Provider value={fieldTypes}>
                                {children}
                            </FieldTypesCtx.Provider>
                        </FormFieldsDataCtx.Provider>
                    </FormDataCtx.Provider>
                </>
            )}
        </>
    );
}