const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const {ConfigLoader} = require('@mdcl-co-il/config-loader');
const {makeMongoConnection} = require('./connectionFactory');
const {makeConnection} = require('./connection');


Object.assign(module.exports, {
    ObjectId,
    Connection: makeConnection(ConfigLoader.getGlobalConfig("mongo.connection"), MongoClient),
    Mongo: makeMongoConnection(ConfigLoader.getGlobalConfig("mongo.connection"), MongoClient, mongoose),
});