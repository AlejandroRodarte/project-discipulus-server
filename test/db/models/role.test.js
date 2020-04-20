const Role = require('../../../src/db/models/role');

describe('Invalid role models', () => {

    test('Should not create a role without a name', () => {

        const roleDoc = {};
        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();

    });

});
