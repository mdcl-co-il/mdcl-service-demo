const {Router} = require('express');
const router = new Router();
const {AuthController} = require('../controllers');
const {makeAuthRouter} = require('./auth');
const {makeUserRouter} = require('./user');

Object.assign(module.exports, {
    AuthRouter: makeAuthRouter(router, AuthController),
    UserRouter: makeUserRouter(router)
})