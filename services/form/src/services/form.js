const makeNewFormsService = (dal) => {

    const createForm = async (formData, user) => {
        return await dal.createNewForm(formData, user);
    };

    const getForm = async (formId, user) => {
        return await dal.getForm(formId);
    };

    const getFormFills = async (formId, user) => {
        return await dal.getFormFills(formId);
    };

    const getFormsList = async () => {
        return await dal.getFormsList();
    };

    const getReportFieldsList = async (formId) => {
        return await dal.getReportFieldsList(formId);
    };

    const checkUniqueKey = async (fieldId, value, ignoreFillId) => {
        return await dal.checkUniqueKey(fieldId, value, ignoreFillId);
    };

    const getFillIdFromKey = async (formId, value) => {
        const form = await dal.getForm(formId, null);
        const keyFieldId = form.fields.filter(field => field.isKey)[0]._id;
        const find = form.fillData.filter(fill => fill.dataMap.filter(field => field.fieldId === keyFieldId && field.value === value).length > 0);
        if (find.length > 0) {
            return find[0].id;
        } else {
            return "NA";
        }
    };

    const deleteForm = async (formId, user) => {
        try {
            await dal.deleteForm(formId, user);
            return true;
        } catch (e) {
            return false;
        }
    };

    const updateForm = async (formId, formData, user) => {
        return await dal.updateForm(formId, formData, user);
    };

    const addFormField = async (formId) => {
        return await dal.addFormField(formId);
    };

    const updateFormField = async (fieldId, data) => {
        return await dal.updateFormField(fieldId, data);
    };

    const deleteFormField = async (fieldId) => {
        return await dal.deleteFormField(fieldId);
    };

    const fillForm = async (formId, data, user) => {
        return await dal.fillForm(formId, data, user);
    };

    return Object.freeze({
        createForm,
        getForm,
        getFormFills,
        getFormsList,
        getReportFieldsList,
        checkUniqueKey,
        getFillIdFromKey,
        deleteForm,
        updateForm,
        addFormField,
        updateFormField,
        deleteFormField,
        fillForm
    });
}


Object.assign(module.exports, {
    makeNewFormsService
})