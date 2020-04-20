const Role = require('../../../src/db/models/role');

describe('Invalid role models', () => {

    test('Should not create a role without a name', () => {

        const roleDoc = {};
        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();

    });

    test('Should not create a role that does not start with ROLE_', () => {

        const roleDoc = {
            name: 'MY_USER_ROLE'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();

    });

    test('Should not create a role shorter than 6 characters', () => {

        const roleDoc = {
            name: 'ROLE_'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();

    });

    test('Should not create a role longer than 30 characters', () => {

        const roleDoc = {
            name: 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();

    });

});
