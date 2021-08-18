const {User} = require('../models');
const passport = require('passport');
const {sign, verify} = require('jsonwebtoken');
const {LoggerService} = require("../services");
const {makeAuthController} = require('./auth.controller');
const {RtokensDal} = require('../dal')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "devAccessTokenSecret";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "devRefreshTokenSecret";


Object.assign(module.exports, {
    AuthController: makeAuthController(RtokensDal, User, passport, sign, verify, accessTokenSecret, refreshTokenSecret, LoggerService.logger)
})
