const expect = require('chai').expect;

const isSentenceProfane = require('../../../../src/util/functions/is-sentence-profane');

describe('[util/functions] - isSentenceProfane', () => {

    it('Should return true on sentence with a profane word', () => {
        expect(isSentenceProfane('This is some good shit')).to.equal(true);
    });

    it('Should return false on sentence with a profane word', () => {
        expect(isSentenceProfane('Super cool note')).to.equal(false);
    });

});
