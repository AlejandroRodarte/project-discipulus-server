const { Types } = require('mongoose');

const { role, user, userRole } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const roleTypes = require('../../../../src/util/roles');

const roles = [
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_ADMIN
    }
];

const users = generateFakeUsers(1);

const usersRoles = [
    {
        _id: new Types.ObjectId(),
        user: users[0]._id,
        role: roles[0]._id
    }
];

const persisted = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles
};

module.exports = persisted;