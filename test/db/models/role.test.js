const Role = require('../../../src/db/models/role');

describe('Invalid role models', () => {

    test('Should not create a role without a name', () => {

        const roleDoc = {};
        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();
        expect(validationError.message.includes('A role name is required'));

    });

    test('Should not create a role that does not start with ROLE_', () => {

        const roleDoc = {
            name: 'MY_USER_ROLE'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();
        expect(validationError.message.includes('Roles must start with the ROLE_ keyword'));

    });

    test('Should not create a role shorter than 6 characters', () => {

        const roleDoc = {
            name: 'ROLE_'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();
        expect(validationError.message.includes('Role name must be at least 6 characters long'));

    });

    test('Should not create a role longer than 30 characters', () => {

        const roleDoc = {
            name: 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).toBeDefined();
        expect(validationError.message.includes('Role name must be at least 30 characters long'));

    });

});

describe('Valid role models', () => {

    test('Should trim a valid role name', () => {

        const roleDoc = {
            name: '  ROLE_ADMIN '
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).not.toBeDefined();
        expect(role.name).toBe('ROLE_ADMIN');

    });

    test('Should uppercase a valid role name', () => {

        const roleDoc = {
            name: 'role_teacher'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();

        expect(validationError).not.toBeDefined();
        expect(role.name).toBe('ROLE_TEACHER');

    });

});
