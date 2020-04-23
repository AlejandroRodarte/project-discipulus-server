const expect = require('chai').expect;

const Role = require('../../../../src/db/models/role');

const { roleDefinition } = require('../../../../src/db/schemas/role');

const modelFunctions = require('../../../__fixtures__/functions/models');

const roleDoc = {
    name: 'ROLE_TEACHER'
};

let role = new Role(roleDoc);

beforeEach(() => role = modelFunctions.getNewModelInstance(Role, roleDoc));

describe('[db/models/role] - invalid name', () => {

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

    it(`Should not validate a role with a name shorter than ${ minlength } characters`, () => {
        role.name = 'ROLE_A';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.minlength);
    });

    it(`Should not validate a role with a name longer than ${ maxlength } characters`, () => {
        role.name = 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER';
        modelFunctions.testForInvalidModel(role, roleDefinition.name.maxlength);
    });

});

describe('[db/models/role] - valid rolename', () => {

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
