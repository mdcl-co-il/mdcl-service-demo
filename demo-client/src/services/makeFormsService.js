export const makeFormsService = (httpSvc) => {
    const formsRequest = async (query, variables) => {
        const res = await httpSvc.post('/form/graphql', {
            query,
            variables
        });
        return res.data.data;
    };

    const loadFieldTypes = async () => {
        const resp = await formsRequest(`
                    query{
                      getFieldTypes {
                        id
                        name
                      }
                    }`, {});
        return resp.getFieldTypes;
    };

    const loadForms = async () => {
        const resp = await formsRequest(`
                    {
                      getForms {
                        id
                        title
                        lastModifiedDate
                      }
                    }`, {});
        return resp.getForms;
    };

    const newForm = async () => {
        const resp = await formsRequest(`
                    mutation($formData:FormInput) {
                      createForm(formData: $formData) {
                        id
                      }
                    }`, {
            formData: {}
        });
        return resp.createForm.id;
    };

    const getForm = async (formId) => {
        const resp = await formsRequest(`
                 query ($formId: String) {
                  getForm(id: $formId) {
                    id
                    title
                    description
                    lastModifiedDate
                    createdByUser {
                        name
                    }
                    lastModifiedByUser {
                        name
                    }
                    fields {
                      id
                      name
                      type
                      required
                    }
                  }
                }`, {
            formId
        });
        return resp.getForm;
    };

    const updateForm = async (formId, formData) => {
        const resp = await formsRequest(`
                 mutation($formId: String, $formData:FormInput) {
                  updateForm(formId: $formId, formData: $formData) {
                    id
                    title
                    description
                  }
                }`, {
            formId,
            formData
        });
        return resp.updateForm;
    };


    return Object.freeze({
        loadFieldTypes,
        loadForms,
        newForm,
        getForm,
        updateForm
    });
};

