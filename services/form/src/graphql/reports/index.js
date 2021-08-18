const {Schema} = require('./schema');
const {makeReportsResolver} = require('./resolver');
const {ReportService} = require('../../services');
const {Dal, FieldTypes} = require('../../services');
const {Utils} = require('@mdcl-co-il/common');


module.exports = Object.assign(module.exports, {
    Schema,
    Resolver: makeReportsResolver(Dal, ReportService, Utils, FieldTypes)
});