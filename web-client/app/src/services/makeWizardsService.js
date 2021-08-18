export const makeWizardsService = (httpSvc) => {
    const formsRequest = async (query, variables) => {
        const res = await httpSvc.post('/form/graphql', {
            query,
            variables
        });
        if (!res.data) {
            throw new Error("Something went wrong with form service...");
        }
        if (res.data.errors) {
            console.log(res.data.errors);
            throw new Error(res.data.errors[0].message);
        }
        return res.data.data;
    };

    const getEntityReports = async () => {
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
                        visibleFields {
                            id
                            name
                        }
                        inputVariables {
                            name
                            type
                            defaultValue
                        }
                      }
                    }`, {});
        return resp.getReports;
    };

    const newWizard = async () => {
        const resp = await formsRequest(`
                    mutation newWizard {
                      createNewWizard
                    }`, {});
        return resp.createNewWizard;
    };

    const getWizardData = async (wizardId) => {
        const resp = await formsRequest(`
                 query ($wizardId: String) {
                  getWizard(id: $wizardId) {
                    id
                    title
                    wizardCode
                  }
                }`, {
            wizardId
        });
        return resp.getWizard;
    };

    const updateWizard = async (wizardId, data) => {
        const resp = await formsRequest(`
                 mutation ($wizardId: String, $data: String) {
                  updateWizard(id: $wizardId, data: $data) {
                    id
                    title
                  }
                }`, {
            wizardId,
            data: JSON.stringify(data)
        });
        return resp.updateWizard;
    };

    const runWizard = async (wizardId) => {
        const resp = await formsRequest(`
                 query ($wizardId: String) {
                  runWizard(id: $wizardId)
                }`, {
            wizardId
        });
        return resp.runWizard;
    };

    const getWizardsList = async () => {
        const resp = await formsRequest(`
                 query {
                  getWizards {
                    id
                    title
                    lastModifiedDate
                  }
                }`, {});
        return resp.getWizards;
    };

    const deleteWizard = async (wizardId) => {
        const resp = await formsRequest(`
                 mutation ($wizardId: String) {
                  deleteWizard(id: $wizardId)
                }`, {
            wizardId
        });
        return resp.deleteWizard;
    };

    return Object.freeze({
        getEntityReports,
        newWizard,
        getWizardData,
        updateWizard,
        getWizardsList,
        runWizard,
        deleteWizard
    });
};

