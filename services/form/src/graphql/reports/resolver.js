const makeReportsResolver = (dal, reportSvc, utils, FieldTypes) => {
    const runReport = async (_, {payload}, ctx) => {
        return await reportSvc.runReport(payload, ctx.user);
    };

    const saveReport = async (_, {payload}, ctx) => {
        return await reportSvc.saveReport(payload, ctx.user);
    };

    const getReports = async (_, {}, ctx) => {
        return await reportSvc.getReports();
    };

    const getReport = async (_, {id}, ctx) => {
        return await reportSvc.getReport(id);
    };

    const deleteReport = async (_, {id}, ctx) => {
        return await reportSvc.deleteReport(id);
    };

    return Object.freeze({
        Query: {
            runReport,
            getReports,
            getReport
        },
        Mutation: {
            saveReport,
            deleteReport
        }
    });
};


module.exports = Object.assign(module.exports, {
    makeReportsResolver
});