const makeNewFormsService = (dal) => {

    const createForm = async (formData, user) => {
        return await dal.createNewForm(formData, user);
    };

    const getForm = async (formId, user) => {
        return await dal.getForm(formId);
    };

    const getFormsList = async () => {
        return await dal.getFormsList();
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

    return Object.freeze({
        createForm,
        getForm,
        getFormsList,
        deleteForm,
        updateForm
    });
}


Object.assign(module.exports, {
    makeNewFormsService
})