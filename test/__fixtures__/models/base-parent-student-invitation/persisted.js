const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const { roles } = require('../../shared');

// 0: enabled user
// 1: disabled user
// 2-6: enabled users
// 7: disabled user
const users = [
    ...models.generateFakeUsers(1),
    ...models.generateFakeUsers(1, { enabled: false }),
    ...models.generateFakeUsers(5),
    ...models.generateFakeUsers(1, { enabled: false })
];

const usersRoles = [

    // 0. user[0] (enabled) with parent role
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 1. user[1] (disabled) with student role
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2. user[2] (enabled): with parent role
    // 3. user[2] (enabled): with student role
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_PARENT }, { role: roles.ids.ROLE_STUDENT }]),

    // 4. user[3] (enabled): with parent role
    ...util.generateOneToMany('user', users[3]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 5. user[4] (enabled) with parent role
    // 6. user[4] (enabled) with student role
    ...util.generateOneToMany('user', users[4]._id, [{ role: roles.ids.ROLE_PARENT }, { role: roles.ids.ROLE_STUDENT }]),

    // 7. user[5] (enabled) with parent role
    ...util.generateOneToMany('user', users[5]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 8. user[6] (enabled) with student role
    ...util.generateOneToMany('user', users[6]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 9. user[7] (disabled with parent role)
    ...util.generateOneToMany('user', users[7]._id, [{ role: roles.ids.ROLE_PARENT }]),

];

const parentStudents = [
    // 0. user[0] (enabled parent) with user[4] (enabled parent/student)
    ...util.generateOneToMany('parent', users[0]._id, [{ student: users[4]._id }])
];

const parentsStudentsInvitations = [

    // 0: user[0] (parent) with user[3] (student, enabled)
    ...util.generateOneToMany('parent', users[0]._id, [{ student: users[2]._id }]),

    // 1. user[4] (parent) with user[6] (student)
    ...util.generateOneToMany('parent', users[4]._id, [{ student: users[6]._id }]),

    // 2. user[5] (parent) with user[4] (student)
    // 3. user[5] (parent) with user[6] (student)
    ...util.generateOneToMany('parent', users[5]._id, [{ student: users[4]._id }, { student: users[6]._id }]),

];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: usersRoles,
    [db.names.parentStudent.modelName]: parentStudents,
    [db.names.parentStudentInvitation.modelName]: parentsStudentsInvitations
};