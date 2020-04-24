const { Types } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');
const { userRoleDefinition } = require('../../../../src/db/schemas/user-role');
const modelFunctions = require('../../../__fixtures__/functions/models');

const userRoleDoc = {
    role: new Types.ObjectId(),
    user: new Types.ObjectId()
};

let userRole = new UserRole(userRoleDoc);

beforeEach(() => userRole = modelFunctions.getNewModelInstance(UserRole, userRoleDoc));

describe('[db/models/user-role] - invalid role', () => {

    it('Should not validate user-role if a role id is not defined', () => {
        userRole.role = undefined;
        modelFunctions.testForInvalidModel(userRole, userRoleDefinition.role.required);
    });

});

describe('[db/models/user-role] - invalid user', () => {

    it('Should not validate user-role if a user id is not defined', () => {
        userRole.user = undefined;
        modelFunctions.testForInvalidModel(userRole, userRoleDefinition.user.required);
    });

});

describe('[db/models/user-role - valid user-role]', () => {

    it('Should validate user-role with correct ids', () => {
        modelFunctions.testForValidModel(userRole);
    });

});
