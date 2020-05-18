const expect = require('chai').expect;

const db = require('../../../../src/db');
const fixtures = require('../../../__fixtures__');

const roleDoc = {
    name: 'ROLE_TEACHER'
};

let role = new db.models.Role(roleDoc);

beforeEach(() => role = fixtures.functions.models.getNewModelInstance(db.models.Role, roleDoc));

describe('[db/models/role] - invalid name', () => {

    const [minlength] = db.schemas.definitions.roleDefinition.name.minlength;
    const [maxlength] = db.schemas.definitions.roleDefinition.name.maxlength;

    it('Should not create a role without a name', () => {
        role.name = undefined;
        fixtures.functions.models.testForInvalidModel(role, db.schemas.definitions.roleDefinition.name.required);
    });

    it('Should not validate a role that does not match the rolename regexp pattern', () => {
        role.name = 'BAD_ROLE';
        fixtures.functions.models.testForInvalidModel(role, db.schemas.definitions.roleDefinition.name.validate);
    });

    it(`Should not validate a role with a name shorter than ${ minlength } characters`, () => {
        role.name = 'ROLE_A';
        fixtures.functions.models.testForInvalidModel(role, db.schemas.definitions.roleDefinition.name.minlength);
    });

    it(`Should not validate a role with a name longer than ${ maxlength } characters`, () => {
        role.name = 'ROLE_SUPER_ADMINISTRATOR_MAGICIAN_OWNER';
        fixtures.functions.models.testForInvalidModel(role, db.schemas.definitions.roleDefinition.name.maxlength);
    });

});

describe('[db/models/role] - valid rolename', () => {

    it('Should validate correct role names', () => {
        role.name = 'ROLE_PARENT';
        fixtures.functions.models.testForValidModel(role);
    });

    it('Should trim a valid role name', () => {

        role.name = '  ROLE_ADMIN ';
        fixtures.functions.models.testForValidModel(role);

        expect(role.name).to.equal('ROLE_ADMIN');

    });

    it('Should uppercase a valid role name', () => {

        role.name = 'role_teacher';
        fixtures.functions.models.testForValidModel(role);

        expect(role.name).to.equal('ROLE_TEACHER');

    });

});
