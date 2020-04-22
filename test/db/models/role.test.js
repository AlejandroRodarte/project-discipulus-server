const Role = require('../../../src/db/models/role');

const { roleDefinition } = require('../../../src/db/schemas/role');

const modelFunctions = require('../../__fixtures__/functions/models');

let roleDoc;
let role;

beforeEach(() => {

    roleDoc = {
        name: 'ROLE_TEACHER'
    };

    role = new Role(roleDoc);

});

describe('Invalid role models', () => {

    const [minlength] = roleDefinition.name.minlength;
    const [maxlength] = roleDefinition.name.maxlength;

    test('Should not create a role without a name', () => {
        role.name = undefined;
        modelFunctions.testForInvalidModel(role, roleDefinition.name.required);
    });

    test('Should not validate a role that does not match the rolename regexp pattern', () => {
        role.name = 'BAD_ROLE';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.validate);
    });

    test(`Should not validate a role shorter than ${ minlength } characters`, () => {
        role.name = 'ROLE_A';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.minlength);
    });

    test(`Should not validate a role longer than ${ maxlength } characters`, () => {
        role.name = 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.maxlength);
    });

});

describe('Valid role models', () => {

    test('Should validate correct role names', () => {
        role.name = 'ROLE_PARENT';
        modelFunctions.testForValidModel(role);
    });

    test('Should trim a valid role name', () => {

        role.name = '  ROLE_ADMIN ';
        modelFunctions.testForValidModel(role);

        expect(role.name).toBe('ROLE_ADMIN');

    });

    test('Should uppercase a valid role name', () => {

        role.name = 'role_teacher';
        modelFunctions.testForValidModel(role);

        expect(role.name).toBe('ROLE_TEACHER');

    });

});
