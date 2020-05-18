const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const { roles } = require('../../shared');

const users = [

    // 0: enabled user
    ...models.generateFakeUsers(1, { fakeToken: true }),

    // 1: disabled user
    ...models.generateFakeUsers(1, { 
        fakeToken: true,
        enabled: false
    }),

    // 2. enabled user
    ...models.generateFakeUsers(1, { fakeToken: true })

];

const userRoles = [

    // 0: user[0] (enabled) as student
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 1: user[1] (disabled) as student
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2: user[2] (enabled) as teacher
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_TEACHER }])

];

const studentNotes = [
    // 0-1: user[0] with two notes
    ...util.generateOneToMany('user', users[0]._id, [{ note: models.generateFakeNote() }, { note: models.generateFakeNote() }]),
];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.userRole.modelName]: userRoles,
    [db.names.user.modelName]: users,
    [db.names.studentNote.modelName]: studentNotes
};
