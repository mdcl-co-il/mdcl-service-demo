const {makeUserModel} = require('./user');
const {makeTokenModel} = require('./token');
const {makeReportModel} = require('./report');

Object.assign(module.exports, {
    User: makeUserModel().User,
    Token: makeTokenModel().Token,
    Report: makeReportModel().Report
})


