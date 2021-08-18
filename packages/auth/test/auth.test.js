'use strict';
const should = require('should');
require('assert');
const sinon = require('sinon');
const {mockReq, mockRes} = require('sinon-express-mock')
const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {mockApp} = require('./mockApp');

const {makeAuth} = require('../lib/index');
const {User: userModel} = require('@mdcl-co-il/models');

describe('Auth package tests', function () {
    describe('makeAuth tests', function () {
        const accessTokenSecret = "testSecret";
        const aut = makeAuth(passport, passportJWT, LocalStrategy, {}, accessTokenSecret);

        describe('makeAuth must be a function', function () {
            should(makeAuth).be.a.Function();
        });

        describe('makeAuth return object', function () {
            it('should have a init and authMiddleware functions', () => {
                should(aut.init).be.a.Function();
                should(aut.authMiddleware).be.a.Function();
            });
        });

    });

    describe('Auth tests', function () {

        const accessTokenSecret = "testSecret";
        let userSchema = new mongoose.Schema(userModel);
        userSchema.plugin(passportLocalMongoose);
        let User = mongoose.model('User', userSchema);
        const aut = makeAuth(passport, passportJWT, LocalStrategy, User, accessTokenSecret);
        const app = mockApp();

        aut.init(app);

        describe('Auth.init tests', function () {

            it('init must register use passport.initialize', () => {
                should(app.getUsedCalled()).be.exactly(1);
            });

        });

        describe('Auth.authMiddleware tests', function () {
            let authMiddlewareFunction = aut.authMiddleware();

            it('authMiddlewareFunction must return function', () => {
                should(authMiddlewareFunction).be.a.Function();
                should(authMiddlewareFunction.length).be.exactly(3);
            });

            it('authMiddlewareFunction implement next middleware', () => {
                const nextSpy = sinon.spy();
                const req = mockReq({
                    body: {
                        "username": "test",
                        "password": "testpass"
                    }
                });
                const res = mockRes();
                try {
                    authMiddlewareFunction(req, res, nextSpy);
                    (1).should.be.null();
                } catch (error) {
                    error.should.have.value("message", "Cannot read property 'authorization' of undefined")
                }
            });
        });
    });

});