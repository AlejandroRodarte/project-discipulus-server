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

    // 2-5. enabled users
    ...models.generateFakeUsers(4, {
        fakeToken: true,
    }),

    // 6. disabled user
    ...models.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
    }),

    // 7-10. enabled users
    ...models.generateFakeUsers(4, {
        fakeToken: true,
    })

];

const userRoles = [

    // 0. user[0] is an enabled teacher
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_TEACHER }, { role: roles.ids.ROLE_STUDENT }]),

    // 1. user[1] is a disabled student
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 2. user[2] is an enabled parent
    ...util.generateOneToMany('user', users[2]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 3. user[3] is an enabled student
    ...util.generateOneToMany('user', users[3]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 4. user[4] is an enabled student
    ...util.generateOneToMany('user', users[4]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 5. user[5] is an enabled student
    ...util.generateOneToMany('user', users[5]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 6. user[6] is a disabled student
    ...util.generateOneToMany('user', users[6]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 7. user[7] is an enabled parent
    ...util.generateOneToMany('user', users[7]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // 8. user[8] is an enabled student
    ...util.generateOneToMany('user', users[8]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 9. user[9] is an enabled student
    ...util.generateOneToMany('user', users[9]._id, [{ role: roles.ids.ROLE_STUDENT }]),

    // 10. user[10] is an enabled student
    ...util.generateOneToMany('user', users[10]._id, [{ role: roles.ids.ROLE_STUDENT }])

];

const classes = [

    // 0. user[0] has associated a sample class
    ...util.generateOneToMany('user', users[0]._id, [
        models.generateFakeClass({
            titleWords: 5,
            descriptionWords: 20,
            timeRanges: [[0, 20], [50, 80]]
        })
    ])

];

const classStudents = [

    ...util.generateOneToMany('class', classes[0]._id, [

        // 0. class[0] has user[3] as student
        { 
            user: users[3]._id 
        },

        // 1. class[0] has user[8] as student
        { 
            user: users[8]._id 
        }

    ])

];

const classStudentInvitations = [

    ...util.generateOneToMany('class', classes[0]._id, [

        // 0. class[0] invited user[4]
        { 
            user: users[4]._id 
        },

        // 1. class[0] invited user[3] (already registered, not possible but still covered)
        { 
            user: users[3]._id 
        }

    ])

];

const classUnknownStudentInvitations = [

    ...util.generateOneToMany('class', classes[0]._id, [

        // 0. class[0] invited user[9]
        { 
            email: users[9].email
        },

        // 1. class[0] invited user[8] (already registered, not possible but still covered)
        { 
            email: users[8].email
        }

    ])

];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: userRoles,
    [db.names.class.modelName]: classes,
    [db.names.classStudent.modelName]: classStudents,
    [db.names.classStudentInvitation.modelName]: classStudentInvitations,
    [db.names.classUnknownStudentInvitation.modelName]: classUnknownStudentInvitations
};
