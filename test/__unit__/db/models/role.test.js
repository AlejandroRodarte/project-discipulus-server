const expect = require('chai').expect;

const Role = require('../../../../src/db/models/role');

const { roleDefinition } = require('../../../../src/db/schemas/role');

const modelFunctions = require('../../../__fixtures__/functions/models');

const roleDoc = {
    name: 'ROLE_TEACHER'
};

let role = new Role(roleDoc);

describe('Invalid role models', () => {

    beforeEach(() => role = modelFunctions.getNewModelInstance(Role, roleDoc));

    const [minlength] = roleDefinition.name.minlength;
    const [maxlength] = roleDefinition.name.maxlength;

    it('Should not create a role without a name', () => {
        role.name = undefined;
        modelFunctions.testForInvalidModel(role, roleDefinition.name.required);
    });

    it('Should not validate a role that does not match the rolename regexp pattern', () => {
        role.name = 'BAD_ROLE';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.validate);
    });

    it(`Should not validate a role shorter than ${ minlength } characters`, () => {
        role.name = 'ROLE_A';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.minlength);
    });

    it(`Should not validate a role longer than ${ maxlength } characters`, () => {
        role.name = 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.maxlength);
    });

});

describe('Valid role models', () => {

    beforeEach(() => role = modelFunctions.getNewModelInstance(Role, roleDoc));

    it('Should validate correct role names', () => {
        role.name = 'ROLE_PARENT';
        modelFunctions.testForValidModel(role);
    });

    it('Should trim a valid role name', () => {

        role.name = '  ROLE_ADMIN ';
        modelFunctions.testForValidModel(role);

        expect(role.name).to.equal('ROLE_ADMIN');

    });

    it('Should uppercase a valid role name', () => {

        role.name = 'role_teacher';
        modelFunctions.testForValidModel(role);

        expect(role.name).to.equal('ROLE_TEACHER');

    });

});
