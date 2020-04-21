const trimRedundantSpaces = require('../../../src/util/functions/trim-redundant-spaces');

describe('trimRedundantSpaces', () => {

    test('Should remove redundant spaces', () => {
        expect(trimRedundantSpaces('     My     Name   ')).toBe('My Name');
    });

});
