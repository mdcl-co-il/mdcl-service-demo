import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {FormsSvc, UtilsSvc} from "../services";

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

const FormActionsCtx = createContext([]);

export function FormActionsContext() {
    return useContext(FormActionsCtx);
}

const FormsListCtx = createContext([]);

export function FormsListContext() {
    return useContext(FormsListCtx);
}

const EntityReportDataCtx = createContext({});

export function EntityReportDataContext() {
    return useContext(EntityReportDataCtx);
}

export function FormsProvider({children}) {
    let {form_id, entity_id} = useParams();

    const [formData, setFormData] = useState({});
    const [formFieldsData, setFormFieldsData] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [formActions, setFormActions] = useState({});
    const [formsList, setFormsList] = useState([]);
    const [entityReportData, setEntityReportData] = useState({});
    const [loading, setLoading] = useState(false);

    const loadForm = useCallback(async () => {
        const formData = await FormsSvc.getForm(form_id);
        setFormFieldsData(formData.fields);
        delete formData.field;
        setFormData(formData);
    }, [form_id]);

    const loadEntityReport = useCallback(async () => {
        if (entity_id !== "0") {
            const entityReportData = await FormsSvc.getEntityReport(entity_id);
            setEntityReportData(entityReportData);
        } else {
            setEntityReportData({
                title: "Report - " + UtilsSvc.generateId(),
                description: "some description",
                baseForm: form_id,
                allFields: [],
                visibleFields: [],
                inputVariables: [],
                inputVariablesText: "",
                findObject: null
            });
        }
    }, [entity_id, form_id]);

    const updateForm = useCallback(async (data) => {
        await FormsSvc.updateForm(form_id, data);
        await loadForm();
    }, [form_id, loadForm]);

    const addFormField = useCallback(async () => {
        await FormsSvc.addFormField(form_id);
        await loadForm();
    }, [form_id, loadForm]);

    const updateFormField = useCallback(async (fieldId, data) => {
        await FormsSvc.updateFormField(fieldId, data);
        await loadForm();
    }, [loadForm]);

    const deleteFormField = useCallback(async (fieldId) => {
        await FormsSvc.deleteFormField(fieldId);
        await loadForm();
    }, [loadForm]);

    const loadFormContext = useCallback(async () => {
        setLoading(true);
        await loadForm();
        await loadEntityReport();
        const fieldTypes = await FormsSvc.loadFieldTypes();
        setFieldTypes(fieldTypes);
        const allForms = await FormsSvc.loadForms();
        setFormsList(allForms.filter(form => form.id !== form_id));
        setFormActions({
            updateForm,
            addFormField,
            updateFormField,
            deleteFormField,
            setFormFieldsData,
            fillForm: FormsSvc.fillForm,
            getFormFills: FormsSvc.getFormFills,
            getReportFieldsList: FormsSvc.getReportFieldsList,
            runReport: FormsSvc.runReport,
            saveReport: FormsSvc.saveReport,
        });
        setLoading(false);
    }, [form_id,
        loadForm,
        loadEntityReport,
        updateForm,
        addFormField,
        updateFormField,
        deleteFormField]);

    useEffect(() => {
        loadFormContext()
            .then(() => {
            });
        return () => {
        };
    }, [form_id, loadFormContext]);

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
                                <FormActionsCtx.Provider value={formActions}>
                                    <FormsListCtx.Provider value={formsList}>
                                        <EntityReportDataCtx.Provider value={entityReportData}>
                                            {children}
                                        </EntityReportDataCtx.Provider>
                                    </FormsListCtx.Provider>
                                </FormActionsCtx.Provider>
                            </FieldTypesCtx.Provider>
                        </FormFieldsDataCtx.Provider>
                    </FormDataCtx.Provider>
                </>
            )}
        </>
    );
}