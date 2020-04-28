const { Types } = require('mongoose');

const { role, user, userRole, parentStudentInvitation } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const { roles, ids } = require('../../shared/roles');

// 0: enabled user
// 1: disabled user
// 2-6: enabled users
const users = [
    ...generateFakeUsers(1),
    ...generateFakeUsers(1, { enabled: false }),
    ...generateFakeUsers(5)
];

const usersRoles = [

    // 0. user one (enabled) with parent role
    {
        _id: new Types.ObjectId(),
        user: users[0]._id,
        role: ids.ROLE_PARENT
    },

    // 1. user two (disabled) with student role
    {
        _id: new Types.ObjectId(),
        user: users[1]._id,
        role: ids.ROLE_STUDENT
    },

    // 2. user three (enabled): with parent role
    {
        _id: new Types.ObjectId(),
        user: users[2]._id,
        role: ids.ROLE_PARENT
    },

    // 3. user three (enabled): with student role
    {
        _id: new Types.ObjectId(),
        user: users[2]._id,
        role: ids.ROLE_STUDENT
    },

    // 4. user four (enabled): with parent role
    {
        _id: new Types.ObjectId(),
        user: users[3]._id,
        role: ids.ROLE_PARENT
    },

    // 5. user five (enabled) with parent role
    {
        _id: new Types.ObjectId(),
        user: users[4]._id,
        role: ids.ROLE_PARENT
    },

    // 6. user five (enabled) with student role
    {
        _id: new Types.ObjectId(),
        user: users[4]._id,
        role: ids.ROLE_STUDENT
    },

    // 7. user (enabled) six with parent role
    {
        _id: new Types.ObjectId(),
        user: users[5]._id,
        role: ids.ROLE_PARENT
    },

    // 8. user (enabled) seven with student role
    {
        _id: new Types.ObjectId(),
        user: users[6]._id,
        role: ids.ROLE_STUDENT
    }

];

const parentsStudentsInvitations = [

    // 0: user one (parent) with user four (student, enabled)
    {
        _id: new Types.ObjectId(),
        parent: users[0]._id,
        student: users[2]._id
    },

    // 1. user five (parent) with user seven (student)
    {
        _id: new Types.ObjectId(),
        parent: users[4]._id,
        student: users[6]._id
    },

    // 2. user six (parent) with user five (student)
    {
        _id: new Types.ObjectId(),
        parent: users[5]._id,
        student: users[4]._id
    },

    // 3. user six (parent) with user seven (student)
    {
        _id: new Types.ObjectId(),
        parent: users[5]._id,
        student: users[6]._id
    }

];

const persisted = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles,
    [parentStudentInvitation.modelName]: parentsStudentsInvitations
};

module.exports = persisted;