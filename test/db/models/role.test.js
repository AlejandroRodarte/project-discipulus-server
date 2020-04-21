const Role = require('../../../src/db/models/role');

const { roleDefinition } = require('../../../src/db/schemas/role');

let roleDoc;
let role;

beforeEach(() => {

    roleDoc = {
        name: 'ROLE_TEACHER'
    };

    role = new Role(roleDoc);

});

describe('Invalid role models', () => {

    const [regexp] = roleDefinition.name.validate;
    const [minlength] = roleDefinition.name.minlength;
    const [maxlength] = roleDefinition.name.maxlength;

    test('Should not create a role without a name', () => {

        role.name = null;

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.required;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a role with an unmatched ${ regexp } pattern`, () => {

        role.name = 'BAD_ROLE';

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.validate;
    
        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a role shorter than ${ minlength } characters`, () => {

        role.name = 'ROLE_';

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.minlength;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a role longer than ${ maxlength } characters`, () => {

        role.name = 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER';

        const validationError = role.validateSync();
        const [, validationMessage] = roleDefinition.name.maxlength;

        expect(validationError).toBeDefined();
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Valid role models', () => {

    test('Should validate correct role names', () => {

        role.name = 'ROLE_PARENT';

        const validationError = role.validateSync();
        expect(validationError).not.toBeDefined();

    });

    test('Should trim a valid role name', () => {

        role.name = '  ROLE_ADMIN ';

        const validationError = role.validateSync();

        expect(validationError).not.toBeDefined();
        expect(role.name).toBe('ROLE_ADMIN');

    });

    test('Should uppercase a valid role name', () => {

        role.name = 'role_teacher';

        const validationError = role.validateSync();

        expect(validationError).not.toBeDefined();
        expect(role.name).toBe('ROLE_TEACHER');

    });

});
