require('should');
require('assert');
const {makeTokenModel} = require('../lib/token')

describe('token model tests', () => {
    const tokenModel = makeTokenModel().Token;
    it('token model username field', () => {
        tokenModel.username.should.be.Function();
        should(tokenModel.username.name).be.exactly("String");
    });

    it('token model rtoken field', () => {
        tokenModel.rtoken.should.be.Function();
        should(tokenModel.rtoken.name).be.exactly("String");
    });

});