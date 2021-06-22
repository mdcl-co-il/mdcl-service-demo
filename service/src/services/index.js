const {ConfigLoader} = require('@mdcl-co-il/config-loader');
const MongoClient = require('@mdcl-co-il/mongo');
const {Logger} = require('@mdcl-co-il/logger');
const {Utils} = require('@mdcl-co-il/common');
const {makeDbService} = require('./db');
const {makeLoggerService} = require('./logger');
const {makeNewFormsService} = require('./form');
const {makeNewDal} = require('./dal');
const {makeFieldType} = require('./fieldType');

let LoggerService;

const init = (serviceConfig) => {
    const DbService = makeDbService(MongoClient);
    LoggerService = makeLoggerService(Logger, serviceConfig);
    return Object.freeze({
        DbService
    });
};

const Dal = makeNewDal(MongoClient, Utils);

Object.assign(module.exports, {
    init,
    LoggerService: () => {
        return LoggerService;
    },
    NewFormsService: makeNewFormsService(Dal),
    FieldTypes: makeFieldType()
})