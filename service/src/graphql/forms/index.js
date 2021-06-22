const {Schema} = require('./schema');
const {makeFormsResolver} = require('./resolver');
const {FormsService, NewFormsService} = require('../../services');
const {Dal, FieldTypes} = require('../../services');
const {Utils} = require('@mdcl-co-il/common');


module.exports = Object.assign(module.exports, {
    Schema,
    Resolver: makeFormsResolver(Dal, FormsService, NewFormsService, Utils, FieldTypes)
});