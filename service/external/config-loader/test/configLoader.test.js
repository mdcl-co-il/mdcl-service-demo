require('should');
require('assert');
const {resolve} = require('path');
const {ConfigLoader} = require('../lib/config.loader');

describe('config loader tests', () => {
    const cl = new ConfigLoader('test', resolve(__dirname, './config-test'));

    it('get global config should fetch the right config', () => {
        const conf = cl.getGlobalConfig("test-config");
        conf.should.have.property('test-key', 'test-value');
    });

    it('get global config with nested key should fetch the right config', () => {
        const conf = cl.getGlobalConfig("test-config.nested-key");
        conf.should.have.property('nested-key1', 'nested-value1');
    });

    it('get service config should fetch the right config', () => {
        const conf = cl.getServiceConfig("test-service");
        conf.should.have.property('applicationName', 'test service config');
    });

    it('get service config with nested key should fetch the right config', () => {
        const conf = cl.getServiceConfig("test-service.nested-svc-key");
        conf.should.have.property('nested-key1', 'nested-value1');
    });

    it('get config without key should fetch default value', () => {
        const conf = cl.getServiceConfig("not-existing", {"default-key": "default-value"});
        conf.should.have.property('default-key', 'default-value');
    });

    it('get config without value should fetch default value', () => {
        const conf = cl.getGlobalConfig("test-config.not-exists-key", {"default-key": "default-value"});
        conf.should.have.property('default-key', 'default-value');
    });

});