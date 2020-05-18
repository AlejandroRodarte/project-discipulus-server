const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { models } = require('../../functions');

const { roles } = require('../../../../src/util');

const roleDocs = [

    // 0: admin role
    {
        _id: new Types.ObjectId(),
        name: roles.ROLE_ADMIN
    },

    // 1. parent role
    {
        _id: new Types.ObjectId(),
        name: roles.ROLE_PARENT
    }

];

// 0-2: generate 3 enabled fake users
const users = models.generateFakeUsers(3);

const usersRoles = [

    // 0. user one with admin role
    {
        _id: new Types.ObjectId(),
        user: users[0]._id,
        role: roleDocs[0]._id
    },

    // 1. user two with admin role
    {
        _id: new Types.ObjectId(),
        user: users[1]._id,
        role: roleDocs[0]._id
    },

    // 2. user two with parent role
    {
        _id: new Types.ObjectId(),
        user: users[1]._id,
        role: roleDocs[1]._id
    }

];

const persisted = {
    [db.names.role.modelName]: roleDocs,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: usersRoles
};

module.exports = persisted;