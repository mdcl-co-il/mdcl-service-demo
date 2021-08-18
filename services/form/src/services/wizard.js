const loki = require('lokijs');

const makeWizardService = (dal, reportSvc, loggerSvc) => {

    const createNewWizard = async (user) => {
        return await dal.createNewWizard(user);
    };

    const getWizard = async (id) => {
        return await dal.getWizard(id);
    };

    const updateWizard = async (id, data, user) => {
        return await dal.updateWizard(id, JSON.parse(data), user);
    };

    const wizardCodeRunner = async (code) => {

        const getEntityReport = async (reportid, ...args) => {
            const options = await dal.getReport(reportid);
            let i = 0;
            for (let inVar of options.inputVariables) {
                options.variables.push({
                    name: inVar.name,
                    value: args[i]
                })
                i++;
            }
            return await reportSvc.runReport(JSON.stringify(options));
        }
        let logs = [];
        const console = {
            log: (...args) => {
                args.forEach(arg => {
                    logs.push(JSON.stringify(arg));
                });
            },
            warn: (...args) => {
                args.forEach(arg => {
                    logs.push(JSON.stringify(arg));
                });
            },
            error: (...args) => {
                args.forEach(arg => {
                    logs.push(JSON.stringify(arg));
                });
            }
        }

        const AsyncFunction = Object.getPrototypeOf(async function () {
        }).constructor;
        return {
            logs,
            data: await new AsyncFunction('getEntityReport', 'console', `"use strict";
            ${code}
            return output;`)(getEntityReport, console)
        }
    };

    const getWizards = async () => {
        return await dal.getWizards();
    };

    const runWizard = async (id) => {
        const wizardData = await dal.getWizard(id);
        return await wizardCodeRunner(wizardData.wizardCode);
    };

    const deleteWizard = async (id, user) => {
        return await dal.deleteWizard(id);
    };

    return Object.freeze({
        createNewWizard,
        getWizard,
        updateWizard,
        getWizards,
        runWizard,
        deleteWizard
    });
}


Object.assign(module.exports, {
    makeWizardService
})