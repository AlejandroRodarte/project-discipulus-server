const { Types } = require('mongoose');

const { role, user, userRole } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const roleTypes = require('../../../../src/util/roles');

const roles = [

    // 0: admin role
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_ADMIN
    },

    // 1. parent role
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_PARENT
    }

];

// 0-2: generate 3 fake users
const users = generateFakeUsers(3);

const usersRoles = [

    // 0. user one with admin role
    {
        _id: new Types.ObjectId(),
        user: users[0]._id,
        role: roles[0]._id
    },

    // 1. user two with admin role
    {
        _id: new Types.ObjectId(),
        user: users[1]._id,
        role: roles[0]._id
    },

    // 2. user two with parent role
    {
        _id: new Types.ObjectId(),
        user: users[1]._id,
        role: roles[1]._id
    }

];

const persisted = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles
};

module.exports = persisted;