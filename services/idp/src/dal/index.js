const mongoose = require('mongoose');
const {LoggerService} = require("../services");
const {makeRtokensDal} = require('./rtokens');


Object.assign(module.exports, {
    RtokensDal: makeRtokensDal(mongoose, LoggerService.logger)
})