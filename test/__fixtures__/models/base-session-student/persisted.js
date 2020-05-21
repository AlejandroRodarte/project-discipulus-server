const { models, util } = require('../../functions');

const { roles } = require('../../shared');

const { db } = require('../../../../src/shared');

const users = [

    // 0. enabled user
    ...models.generateFakeUsers(1, {
        fakeToken: true
    }),

    // 1. disabled user
    ...models.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
    }),

    // 2-3. enabled users
    ...models.generateFakeUsers(2, {
        fakeToken: true,
    })

];

const userRoles = [

    // 0. user[0] as teacher
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_TEACHER }]),

    // 1. user[1] is as student
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2. user[2] as student
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 3. user[3] as student
    ...util.generateOneToMany('user', users[3]._id, [{ role: roles.ids.ROLE_STUDENT }])

];

// 0. user[0] has associated a sample class
const classes = [
    ...util.generateOneToMany('user', users[0]._id, [ models.generateFakeClass() ])
];

const classStudents = [

    // 0-2: class[0] has users from [1] to [3] as students
    ...util.generateOneToMany('class', classes[0]._id, [
        { user: users[1]._id },
        { user: users[2]._id },
        { user: users[3]._id }
    ])

];

const sessions = [
    // 0. class[0] has associated a sample session
    ...util.generateOneToMany('class', classes[0]._id, [ models.generateFakeSession() ])
];

const sessionStudents = [
    // 0. session[0] has registered classStudent[1] (user[2])
    ...util.generateOneToMany('session', sessions[0]._id, [{ classStudent: classStudents[1]._id }])
];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: userRoles,
    [db.names.class.modelName]: classes,
    [db.names.classStudent.modelName]: classStudents,
    [db.names.session.modelName]: sessions,
    [db.names.sessionStudent.modelName]: sessionStudents
};
