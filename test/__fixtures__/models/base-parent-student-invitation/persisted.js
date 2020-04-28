const { Types } = require('mongoose');

const { role, user, userRole, parentStudent } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const roleTypes = require('../../../../src/util/roles');

const roles = [

    // 0: parent role
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_PARENT
    },

    // 1. student role
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_STUDENT
    }

];

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
        role: roles[0]._id
    },

    // 1. user two (disabled) with student role
    {
        _id: new Types.ObjectId(),
        user: users[1]._id,
        role: roles[1]._id
    },

    // 2. user three (enabled): with student role
    {
        _id: new Types.ObjectId(),
        user: users[2]._id,
        role: roles[1]._id
    },

    // 3. user three (enabled): with parent role
    {
        _id: new Types.ObjectId(),
        user: users[2]._id,
        role: roles[0]._id
    },

    // 4. user four (enabled): with student role
    {
        _id: new Types.ObjectId(),
        user: users[3]._id,
        role: roles[1]._id
    },

    // 5. user five with parent role
    {
        _id: new Types.ObjectId(),
        user: users[4]._id,
        role: roles[0]._id
    },

    // 6. user five with student role
    {
        _id: new Types.ObjectId(),
        user: users[4]._id,
        role: roles[1]._id
    },

    // 7. user six with parent role
    {
        _id: new Types.ObjectId(),
        user: users[5]._id,
        role: roles[0]._id
    },

    // 8. user seven with student role
    {
        _id: new Types.ObjectId(),
        user: users[6]._id,
        role: roles[1]._id
    }

];

const parentsStudents = [

    // 0: user one (student) with user three (parent, enabled)
    {
        _id: new Types.ObjectId(),
        parent: users[2]._id,
        student: users[0]._id
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
    [parentStudent.modelName]: parentsStudents
};

module.exports = persisted;