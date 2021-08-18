const makeReportModel = (reportModel, mongooseSchema, mongooseModel) => {
    let reportSchema = new mongooseSchema(reportModel);
    let Report = mongooseModel('Report', reportSchema);

    return Object.freeze({
        Report
    });
};

Object.assign(module.exports, {
    makeReportModel
})