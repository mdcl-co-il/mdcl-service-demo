const expect = require('chai').expect;
describe('Example mocha + chai test by Aviad', () => {
 it('should return 42', () => {
        expect(21 * 2).to.equal(42);
    });
 it('should return 87', () => {
        expect(40 * 2 + 7).to.equal(87);
    });
});