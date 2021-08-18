const makeFormsResolver = (dal, formsSvc, reportSvc, utils, FieldTypes) => {

    const getForms = async () => {
        return await formsSvc.getFormsList();
    };

    const getForm = async (_, {id}) => {
        return await formsSvc.getForm(id);
    };

    const getFormFills = async (_, {id}) => {
        return await formsSvc.getFormFills(id);
    };

    const getReportFieldsList = async (_, {id}) => {
        return await formsSvc.getReportFieldsList(id);
    };

    const checkUniqueKey = async (_, {fieldId, value, ignoreFillId}) => {
        return await formsSvc.checkUniqueKey(fieldId, value, ignoreFillId);
    };

    const getFillIdFromKey = async (_, {formId, value}) => {
        return await formsSvc.getFillIdFromKey(formId, value);
    };

    const createForm = async (_, args, ctx) => {
        return await formsSvc.createForm(args.formData, ctx.user)
    };

    const deleteForm = async (_, {id}, ctx) => {
        return await formsSvc.deleteForm(id, ctx.user);
    };

    const getFieldTypes = async () => {
        return FieldTypes.fieldTypes;
    };

    const updateForm = async (_, {formId, formData}, ctx) => {
        return await formsSvc.updateForm(formId, formData, ctx.user);
    };

    const addFormField = async (_, {formId}, ctx) => {
        return await formsSvc.addFormField(formId);
    };

    const updateFormField = async (_, {fieldId, data}, ctx) => {
        return await formsSvc.updateFormField(fieldId, data);
    };

    const deleteFormField = async (_, {fieldId}, ctx) => {
        return await formsSvc.deleteFormField(fieldId);
    };

    const fillForm = async (_, {formId, data}, ctx) => {
        return await formsSvc.fillForm(formId, data, ctx.user);
    };

    return Object.freeze({
        Query: {
            getFieldTypes,
            getForms,
            getForm,
            getFormFills,
            getReportFieldsList,
            checkUniqueKey,
            getFillIdFromKey
        },
        Mutation: {
            createForm,
            deleteForm,
            updateForm,
            addFormField,
            updateFormField,
            deleteFormField,
            fillForm
        }
    });
};


module.exports = Object.assign(module.exports, {
    makeFormsResolver
});