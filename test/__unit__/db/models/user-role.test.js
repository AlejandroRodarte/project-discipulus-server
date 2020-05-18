const { Types } = require('mongoose');

const db = require('../../../../src/db');
const fixtures = require('../../../__fixtures__');

const userRoleDoc = {
    role: new Types.ObjectId(),
    user: new Types.ObjectId()
};

let userRole = new db.models.UserRole(userRoleDoc);

beforeEach(() => userRole = fixtures.functions.models.getNewModelInstance(db.models.UserRole, userRoleDoc));

describe('[db/models/user-role] - invalid role', () => {

    it('Should not validate user-role if a role id is not defined', () => {
        userRole.role = undefined;
        fixtures.functions.models.testForInvalidModel(userRole, db.schemas.definitions.userRoleDefinition.role.required);
    });

});

describe('[db/models/user-role] - invalid user', () => {

    it('Should not validate user-role if a user id is not defined', () => {
        userRole.user = undefined;
        fixtures.functions.models.testForInvalidModel(userRole, db.schemas.definitions.userRoleDefinition.user.required);
    });

});

describe('[db/models/user-role] - valid user-role', () => {

    it('Should validate user-role with correct ids', () => {
        fixtures.functions.models.testForValidModel(userRole);
    });

});
