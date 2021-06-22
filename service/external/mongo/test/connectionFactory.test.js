require('should');
require('assert');
const {resolve} = require('path');
const {ConfigLoaderClass} = require('@mdcl-co-il/config-loader');
const {makeMongoConnection} = require('../lib/connectionFactory');

describe('connection factory tests', () => {

    it('build simple connection url', () => {
        const configLoader = new ConfigLoaderClass("test", resolve(__dirname, "test-config"))
        const mongo = makeMongoConnection(configLoader.getGlobalConfig("mongo-simple.connection"), {}, {});
        should(mongo.connUrl).be.exactly("mongodb://localhost:27017/dbnametest?retryWrites=true&w=majority");
    });

    it('build complex connection url', () => {
        const configLoader = new ConfigLoaderClass("test", resolve(__dirname, "test-config"))
        const mongo = makeMongoConnection(configLoader.getGlobalConfig("mongo-complex.connection"), {}, {});
        should(mongo.connUrl).be.exactly("mongodb+srv://test-user:somepass1234!@testhost.test/dbnametest?retryWrites=true&w=majority");
    });


    it('call mongoose connect', async () => {
        const configLoader = new ConfigLoaderClass("test", resolve(__dirname, "test-config"))
        const mongo = makeMongoConnection(configLoader.getGlobalConfig("mongo-complex.connection"), {}, {
            connect: async () => {
                return new Promise(resolve => {
                    resolve(true);
                });
            }
        });
        const res = await mongo.connectMongoose();
        should(res).be.exactly(true);
    });

});