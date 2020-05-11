const { generateFakeClass, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { roles, ids } = require('../../shared/roles');

const { user, class: clazz, role, userRole } = require('../../../../src/db/names');

const users = [

    // 0. disabled user
    ...generateFakeUsers(1, {
        enabled: false,
        fakeToken: true
    }),

    // 1-2. enabled users
    ...generateFakeUsers(2, {
        fakeToken: false
    })

];

const userRoles = [

    // 0. user[0] is a disabled teacher
    ...generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_TEACHER }]),

    // 1. user[1] is an enabled student
    ...generateOneToMany('user', users[1]._id, [{ role: ids.ROLE_STUDENT }]),

    // 2. user[2] is an enabled teacher
    ...generateOneToMany('user', users[2]._id, [{ role: ids.ROLE_TEACHER }])

];

const classes = [

    // 0. user[2] (enabled teacher) will have an associated class
    ...generateOneToMany('user', users[2]._id, [
        generateFakeClass({
            titleWords: 5,
            descriptionWords: 20,
            sessions: [[0, 20], [50, 80]]
        })
    ])

];

module.exports = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: userRoles,
    [clazz.modelName]: classes
};
