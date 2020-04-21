const Role = require('../../../src/db/models/role');

const { roleDefinition } = require('../../../src/db/schemas/role');

describe('Invalid role models', () => {

    const [regexp] = roleDefinition.name.validate;
    const [minlength] = roleDefinition.name.minlength;
    const [maxlength] = roleDefinition.name.maxlength;

    test('Should not create a role without a name', () => {

        const roleDoc = {};
        const role = new Role(roleDoc);

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.required;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a role that does not start with ${ regexp }`, () => {

        const roleDoc = {
            name: 'MY_USER_ROLE'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.validate;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a role shorter than ${ minlength } characters`, () => {

        const roleDoc = {
            name: 'ROLE_'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.minlength;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a role longer than ${ maxlength } characters`, () => {

        const roleDoc = {
            name: 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER'
        };

        const role = new Role(roleDoc);

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.maxlength;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

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
