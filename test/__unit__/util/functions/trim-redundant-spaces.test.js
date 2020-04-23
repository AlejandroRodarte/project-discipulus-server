const expect = require('chai').expect;

const trimRedundantSpaces = require('../../../../src/util/functions/trim-redundant-spaces');

describe('trimRedundantSpaces', () => {

    it('Should remove redundant spaces', () => {
        expect(trimRedundantSpaces('     My     Name   ')).to.equal('My Name');
    });

});
