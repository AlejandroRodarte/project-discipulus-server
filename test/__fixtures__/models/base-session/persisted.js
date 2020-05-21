const { models, util } = require('../../functions');
const { roles } = require('../../shared');

const { db } = require('../../../../src/shared');

const users = [

    // 0. enabled user
    ...models.generateFakeUsers(1, { fakeToken: true }),

    // 1. disabled user
    ...models.generateFakeUsers(1, { fakeToken: false, enabled: false }),

    // 2-4. enabled users
    ...models.generateFakeUsers(3, { fakeToken: false })

];

const userRoles = [

    // 0. user[0] as teacher
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_TEACHER }]),

    // 1. user[1] as student
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2. user[2] as student
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 3. user[3] as student
    ...util.generateOneToMany('user', users[3]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 4. user[4] as student
    ...util.generateOneToMany('user', users[4]._id, [{ role: roles.ids.ROLE_STUDENT }])

];

const classes = [

    // 0-1. user[0] (teacher) will have associated two classes
    ...util.generateOneToMany('user', users[0]._id, [
        models.generateFakeClass(),
        models.generateFakeClass()
    ])

];

const classStudents = [

    // 0-3: class[1] has users from [1] to [4] as students
    ...util.generateOneToMany('class', classes[1]._id, [
        { user: users[1]._id },
        { user: users[2]._id },
        { user: users[3]._id },
        { user: users[4]._id }
    ])

];

const sessions = [
    // 0. class[0] has a session associated
    ...util.generateOneToMany('class', classes[0]._id, [ models.generateFakeSession() ])
];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: userRoles,
    [db.names.class.modelName]: classes,
    [db.names.classStudent.modelName]: classStudents,
    [db.names.session.modelName]: sessions
};
