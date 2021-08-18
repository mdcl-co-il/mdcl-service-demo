const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const models = require('@mdcl-co-il/models');
const {makeUserModel} = require('./user');
const {makeTokenModel} = require('./token');


Object.assign(module.exports, {
    User: makeUserModel(models.User, mongoose.Schema, mongoose.model, passportLocalMongoose).User,
    Token: makeTokenModel(models.Token, mongoose.Schema, mongoose.model)
})


