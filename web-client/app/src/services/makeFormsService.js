export const makeFormsService = (httpSvc) => {
    const formsRequest = async (query, variables) => {
        const res = await httpSvc.post('/form/graphql', {
            query,
            variables
        });
        if (!res.data) {
            throw new Error("Something went wrong with form service...");
        }
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
        try {
            const resp = await formsRequest(`
                    {
                      getForms {
                        id
                        title
                        lastModifiedDate
                        fillCount
                        fields {
                            name
                            required
                            isKey
                        }
                      }
                    }`, {});
            return resp.getForms;
        } catch (e) {
            console.error(e);
            return [];
        }
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

    const deleteForm = async (formId) => {
        const resp = await formsRequest(`
                    mutation($formId:String) {
                      deleteForm(id: $formId)
                    }`, {
            formId
        });
        return resp.deleteForm;
    };

    const getForm = async (formId) => {
        const resp = await formsRequest(`
                 query ($formId: String) {
                  getForm(id: $formId) {
                    id
                    title
                    description
                    lastModifiedDate
                    fillCount
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
                      isKey
                      maxLength
                      group
                      extraData
                    }
                  }
                }`, {
            formId
        });
        return resp.getForm;
    };

    const getFormFills = async (formId) => {
        const resp = await formsRequest(`
                 query ($formId: String) {
                  getFormFills(id: $formId) {
                    id
                    user {
                        name
                    }
                    date,
                    data
                  }
                }`, {
            formId
        });
        return resp.getFormFills;
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

    const addFormField = async (formId) => {
        const resp = await formsRequest(`
                 mutation($formId: String) {
                  addFormField(formId: $formId) {
                    id
                  }
                }`, {
            formId
        });
        return resp.addFormField;
    };

    const updateFormField = async (fieldId, data) => {
        const resp = await formsRequest(`
                 mutation($fieldId: String, $data: FieldInput) {
                  updateFormField(fieldId: $fieldId, data: $data) {
                    id
                    type
                    name
                    required
                    maxLength
                    group,
                    extraData,
                  }
                }`, {
            fieldId,
            data
        });
        return resp.updateFormField;
    };

    const deleteFormField = async (fieldId) => {
        const resp = await formsRequest(`
                 mutation($fieldId: String) {
                  deleteFormField(fieldId: $fieldId)
                }`, {
            fieldId
        });
        return resp.deleteFormField;
    };

    const fillForm = async (formId, data) => {
        const relevantData = data.map(field => {
            return {
                fieldId: field.id,
                field: field.name,
                value: field.value
            }
        });

        await formsRequest(`
                 mutation($formId: String, $data: [FieldFillInput]) {
                  fillForm(formId: $formId, data: $data)
                }`, {
            formId,
            data: relevantData
        });
    };

    const getReportFieldsList = async (formId) => {
        const resp = await formsRequest(`
                 query ($formId: String) {
                  getReportFieldsList(id: $formId) {
                    id
                    linkFieldId
                    name
                  }
                }`, {
            formId
        });
        return resp.getReportFieldsList;
    };

    const runReport = async (reportOptions, variables = []) => {
        Object.assign(reportOptions, {
            variables
        });
        const payload = JSON.stringify(reportOptions);
        const resp = await formsRequest(`
                 query ($payload: String) {
                  runReport(payload: $payload) {
                    columns
                    rows
                  }
                }`, {
            payload
        });
        return resp.runReport;
    };

    const saveReport = async (reportOptions) => {
        const payload = JSON.stringify(reportOptions);
        const resp = await formsRequest(`
                 mutation ($payload: String) {
                  saveReport(payload: $payload)
                }`, {
            payload
        });
        return resp.saveReport;
    };

    const getReports = async () => {
        const resp = await formsRequest(`
                 query{
                      getReports {
                        id
                        title
                        lastModifiedDate
                        baseForm
                        createdByUser {
                          name
                        }
                      }
                    }`, {});
        return resp.getReports;
    };

    const getEntityReport = async (entityReportId) => {
        const resp = await formsRequest(`
                 query ($entityReportId: String){
                  getReport (id: $entityReportId) {
                    id
                    title
                    baseForm
                    allFields {
                      id
                      linkFieldId
                      name
                    }
                    visibleFields {
                      id
                      linkFieldId
                      name
                    }
                    inputVariables {
                      name
                      type
                      defaultValue
                    }
                    inputVariablesText
                    findObject
                  }
                }`, {
            entityReportId
        });
        return resp.getReport;
    };

    const isKeyUnique = async (fieldId, value, fillId = "NaN") => {
        const resp = await formsRequest(`
                 query ($fieldId: String, $value: String, $ignoreFillId: String) {
                  checkUniqueKey(fieldId: $fieldId, value: $value, ignoreFillId: $ignoreFillId)
                }`, {
            fieldId,
            value,
            fillId
        });
        return resp.checkUniqueKey;
    };

    const getFillIdFromKey = async (formId, value) => {
        const resp = await formsRequest(`
                 query ($formId: String, $value: String) {
                  getFillIdFromKey(formId: $formId, value: $value)
                }`, {
            formId,
            value
        });
        return resp.getFillIdFromKey;
    };

    const deleteReport = async (reportId) => {
        const resp = await formsRequest(`
                 mutation ($reportId: String) {
                  deleteReport(id: $reportId)
                }`, {
            reportId
        });
        return resp.deleteReport;
    };

    return Object.freeze({
        loadFieldTypes,
        loadForms,
        newForm,
        deleteForm,
        getForm,
        getFormFills,
        updateForm,
        addFormField,
        updateFormField,
        deleteFormField,
        fillForm,
        getReportFieldsList,
        runReport,
        saveReport,
        getReports,
        getEntityReport,
        isKeyUnique,
        getFillIdFromKey,
        deleteReport
    });
};

