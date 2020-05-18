const expect = require('chai').expect;

const { functions } = require('../../../../src/util');

describe('[util/functions] - trimRedundantSpaces', () => {

    it('Should remove redundant spaces', () => {
        expect(functions.trimRedundantSpaces('     My     Name   ')).to.equal('My Name');
    });

});
