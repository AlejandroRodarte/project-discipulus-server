const { models, util } = require('../../functions');
const { roles } = require('../../shared');

const { db } = require('../../../../src/shared');

const users = [

    // 0. disabled user
    ...models.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true
    }),

    // 1-2. enabled users
    ...models.generateFakeUsers(2, {
        fakeToken: false
    })

];

const userRoles = [

    // 0. user[0] is a disabled teacher
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_TEACHER }]),

    // 1. user[1] is an enabled student
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2. user[2] is an enabled teacher
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_TEACHER }])

];

const classes = [

    // 0. user[2] (enabled teacher) will have an associated class
    ...util.generateOneToMany('user', users[2]._id, [
        models.generateFakeClass({
            titleWords: 5,
            descriptionWords: 20,
            sessions: [[0, 20], [50, 80]]
        })
    ])

];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: userRoles,
    [db.names.class.modelName]: classes
};
