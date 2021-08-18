const makeReportModel = () => {
    return Object.freeze({
        Report: {
            _id: Number,
            name: String,
            reportForm: Number,
            type: Number
        }
    });
};


Object.assign(module.exports, {
    makeReportModel
})
