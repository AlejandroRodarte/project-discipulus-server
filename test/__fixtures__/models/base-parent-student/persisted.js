const { role, user, userRole, parentStudent } = require('../../../../src/db/names');

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

    // 0. user one (enabled) with student role
    ...generateOneToMany(['user', 'role'], users[0]._id, [ids.ROLE_STUDENT]),

    // 1. user two (disabled) with parent role
    ...generateOneToMany(['user', 'role'], users[1]._id, [ids.ROLE_PARENT]),

    // 2. user three (enabled): with student role
    // 3. user three (enabled): with parent role
    ...generateOneToMany(['user', 'role'], users[2]._id, [ids.ROLE_STUDENT ,ids.ROLE_PARENT]),

    // 4. user four (enabled): with student role
    ...generateOneToMany(['user', 'role'], users[3]._id, [ids.ROLE_STUDENT]),
    
    // 5. user five (enabled) with parent role
    // 6. user five (enabled) with student role
    ...generateOneToMany(['user', 'role'], users[4]._id, [ids.ROLE_PARENT, ids.ROLE_STUDENT]),

    // 7. user six (enabled) with parent role
    ...generateOneToMany(['user', 'role'], users[5]._id, [ids.ROLE_PARENT]),

    // 8. user seven (enabled) with student role
    ...generateOneToMany(['user', 'role'], users[6]._id, [ids.ROLE_STUDENT])

];

const parentsStudents = [

    // 0: user one (student) with user three (parent, enabled)
    ...generateOneToMany(['parent', 'student'], users[2]._id, [users[0]._id]),

    // 1. user five (parent) with user seven (student)
    ...generateOneToMany(['parent', 'student'], users[4]._id, [users[6]._id]),

    // 2. user six (parent) with user five (student)
    // 3. user six (parent) with user seven (student)
    ...generateOneToMany(['parent', 'student'], users[5]._id, [users[4]._id, users[6]._id])

];

const persisted = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles,
    [parentStudent.modelName]: parentsStudents
};

module.exports = persisted;