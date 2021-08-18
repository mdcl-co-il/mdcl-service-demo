const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "devAccessTokenSecret";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "devRefreshTokenSecret";
const passport = require('passport');
const {User} = require('../models');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const {ConfigLoader} = require('@mdcl-co-il/config-loader');
const mongoose = require('mongoose')
const {Mongo} = require('@mdcl-co-il/mongo');
const {Logger} = require('@mdcl-co-il/logger');
const {makeAuth} = require('@mdcl-co-il/auth');
const {makeDbService} = require('./db');
const {makeLoggerService} = require('./logger');


const init = () => {
    const PassportService = makeAuth(passport, passportJWT, LocalStrategy, User, accessTokenSecret);
    const DbService = makeDbService(mongoose, Mongo);
    return Object.freeze({
        PassportService,
        DbService
    });
};


Object.assign(module.exports, {
    init,
    LoggerService: makeLoggerService(Logger, ConfigLoader.getServiceConfig("idp"))
})