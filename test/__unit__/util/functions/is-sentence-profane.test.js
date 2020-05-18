const expect = require('chai').expect;

const { functions } = require('../../../../src/util');

describe('[util/functions] - isSentenceProfane', () => {

    it('Should return true on sentence with a profane word', () => {
        expect(functions.isSentenceProfane('This is some good shit')).to.equal(true);
    });

    it('Should return false on sentence with a profane word', () => {
        expect(functions.isSentenceProfane('Super cool note')).to.equal(false);
    });

});
