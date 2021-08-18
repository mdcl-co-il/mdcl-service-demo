const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "devAccessTokenSecret";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "devRefreshTokenSecret";
const passport = require('passport');
const {User} = require('../models');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const {ConfigLoader} = require('@mdcl-co-il/config-loader');
const mongoose = require('mongoose')
const MongoClient = require('@mdcl-co-il/mongo');
const {Logger} = require('@mdcl-co-il/logger');
const {makeAuth} = require('@mdcl-co-il/auth');
const {Utils} = require('@mdcl-co-il/common');
const {makeDbService} = require('./db');
const {makeLoggerService} = require('./logger');
const {makeNewFormsService} = require('./form');
const {makeReportService} = require('./report');
const models = require('../models');
const {makeDal} = require('./dal');
const {makeFieldType} = require('./fieldType');
const {makeWizardService} = require("./wizard");

const init = () => {
    const PassportService = makeAuth(passport, passportJWT, LocalStrategy, User, accessTokenSecret);
    const DbService = makeDbService(mongoose, MongoClient);
    return Object.freeze({
        PassportService,
        DbService
    });
};

const LoggerService = makeLoggerService(Logger, ConfigLoader.getServiceConfig("form"));

const Dal = makeDal(MongoClient, models, Utils, LoggerService);

const ReportService = makeReportService(Dal, LoggerService);

Object.assign(module.exports, {
    init,
    LoggerService,
    FormsService: makeNewFormsService(Dal),
    ReportService,
    WizardService: makeWizardService(Dal, ReportService, LoggerService),
    FieldTypes: makeFieldType()
});