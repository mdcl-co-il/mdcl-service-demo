const makeFormsResolver = (dal, formsSvc, newFormSvc, utils, FieldTypes) => {

    const getForms = async () => {
        return await newFormSvc.getFormsList();
    };

    const getForm = async (_, {id}) => {
        return await newFormSvc.getForm(id);
    };

    const createForm = async (_, args, ctx) => {
        return await newFormSvc.createForm(args.formData, ctx.user)
    };

    const deleteForm = async (_, {id}, ctx) => {
        return await newFormSvc.deleteForm(id, ctx.user);
    };

    const getFieldTypes = async () => {
        return FieldTypes.fieldTypes;
    };

    const updateForm = async (_, {formId, formData}, ctx) => {
        return await newFormSvc.updateForm(formId, formData, ctx.user);
    };

    return Object.freeze({
        Query: {
            getFieldTypes,
            getForms,
            getForm
        },
        Mutation: {
            createForm,
            deleteForm,
            updateForm
        }
    });
};


module.exports = Object.assign(module.exports, {
    makeFormsResolver
});