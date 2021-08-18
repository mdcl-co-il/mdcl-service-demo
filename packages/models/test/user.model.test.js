require('should');
require('assert');
const {makeUserModel} = require('../lib/user')

describe('user model tests', () => {
    const userModel = makeUserModel().User;
    it('user model name field', () => {
        userModel.name.should.be.Function();
        should(userModel.name.name).be.exactly("String");
    });

    it('user model lastName field', () => {
        userModel.lastName.should.be.Function();
        should(userModel.lastName.name).be.exactly("String");
    });

    it('user model email field', () => {
        userModel.email.should.be.Function();
        should(userModel.email.name).be.exactly("String");
    });

    it('user model authLevel field', () => {
        userModel.authLevel.should.be.Function();
        should(userModel.authLevel.name).be.exactly("Number");
    });

    it('user model system field', () => {
        userModel.system.should.be.Function();
        should(userModel.system.name).be.exactly("Number");
    });
});