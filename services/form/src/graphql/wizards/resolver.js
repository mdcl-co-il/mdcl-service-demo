const makeWizardsResolver = (dal, wizardSvc, utils) => {
    const createNewWizard = async (_, {}, ctx) => {
        return await wizardSvc.createNewWizard(ctx.user);
    };

    const runWizard = async (_, {id}, ctx) => {
        return await wizardSvc.runWizard(id);
    };

    const getWizard = async (_, {id}, ctx) => {
        return await wizardSvc.getWizard(id);
    };

    const updateWizard = async (_, {id, data}, ctx) => {
        return await wizardSvc.updateWizard(id, data, ctx.user);
    };

    const deleteWizard = async (_, {id}, ctx) => {
        return await wizardSvc.deleteWizard(id, ctx.user);
    };

    const getWizards = async (_, {}, ctx) => {
        return await wizardSvc.getWizards();
    };

    return Object.freeze({
        Query: {
            runWizard,
            getWizard,
            getWizards
        },
        Mutation: {
            createNewWizard,
            updateWizard,
            deleteWizard
        }
    });
};


module.exports = Object.assign(module.exports, {
    makeWizardsResolver
});