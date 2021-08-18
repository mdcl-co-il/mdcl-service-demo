const {Schema} = require('./schema');
const {makeWizardsResolver} = require('./resolver');
const {WizardService} = require('../../services');
const {Dal} = require('../../services');
const {Utils} = require('@mdcl-co-il/common');


module.exports = Object.assign(module.exports, {
    Schema,
    Resolver: makeWizardsResolver(Dal, WizardService, Utils)
});