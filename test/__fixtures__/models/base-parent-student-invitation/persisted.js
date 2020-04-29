const { Types } = require('mongoose');

const { role, user, userRole, parentStudentInvitation } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

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
    ...generateOneToMany(['user', 'role'], users[0]._id, [ids.ROLE_PARENT]),

    // 1. user two (disabled) with student role
    ...generateOneToMany(['user', 'role'], users[1]._id, [ids.ROLE_STUDENT]),

    // 2. user three (enabled): with parent role
    // 3. user three (enabled): with student role
    ...generateOneToMany(['user', 'role'], users[2]._id, [ids.ROLE_PARENT, ids.ROLE_STUDENT]),

    // 4. user four (enabled): with parent role
    ...generateOneToMany(['user', 'role'], users[3]._id, [ids.ROLE_PARENT]),

    // 5. user five (enabled) with parent role
    // 6. user five (enabled) with student role
    ...generateOneToMany(['user', 'role'], users[4]._id, [ids.ROLE_PARENT, ids.ROLE_STUDENT]),

    // 7. user (enabled) six with parent role
    ...generateOneToMany(['user', 'role'], users[5]._id, [ids.ROLE_PARENT]),

    // 8. user (enabled) seven with student role
    ...generateOneToMany(['user', 'role'], users[6]._id, [ids.ROLE_STUDENT])

];

const parentsStudentsInvitations = [

    // 0: user one (parent) with user four (student, enabled)
    ...generateOneToMany(['parent', 'student'], users[0]._id, [users[2]._id]),

    // 1. user five (parent) with user seven (student)
    ...generateOneToMany(['parent', 'student'], users[4]._id, [users[6]._id]),

    // 2. user six (parent) with user five (student)
    // 3. user six (parent) with user seven (student)
    ...generateOneToMany(['parent', 'student'], users[5]._id, [users[4]._id, users[6]._id]),

];

const persisted = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles,
    [parentStudentInvitation.modelName]: parentsStudentsInvitations
};

module.exports = persisted;