const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { roles, ids } = require('../../shared/roles');

const { user, role, userRole, class: clazz, classStudent, classStudentInvitation, classUnknownStudentInvitation } = require('../../../../src/db/names');

const users = [

    // 0. enabled user
    ...modelFunctions.generateFakeUsers(1, {
        fakeToken: true
    }),

    // 1. disabled user
    ...modelFunctions.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
    }),

    // 2-5. enabled users
    ...modelFunctions.generateFakeUsers(4, {
        fakeToken: true,
    }),

    // 6. disabled user
    ...modelFunctions.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
    }),

    // 7-10. enabled users
    ...modelFunctions.generateFakeUsers(4, {
        fakeToken: true,
    })

];

const userRoles = [

    // 0. user[0] is an enabled teacher
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_TEACHER }, { role: ids.ROLE_STUDENT }]),

    // 1. user[1] is a disabled student
    ...utilFunctions.generateOneToMany('user', users[1]._id, [{ role: ids.ROLE_STUDENT }]),

    // 2. user[2] is an enabled parent
    ...utilFunctions.generateOneToMany('user', users[2]._id, [{ role: ids.ROLE_PARENT }]),

    // 3. user[3] is an enabled student
    ...utilFunctions.generateOneToMany('user', users[3]._id, [{ role: ids.ROLE_STUDENT }]),

    // 4. user[4] is an enabled student
    ...utilFunctions.generateOneToMany('user', users[4]._id, [{ role: ids.ROLE_STUDENT }]),

    // 5. user[5] is an enabled student
    ...utilFunctions.generateOneToMany('user', users[5]._id, [{ role: ids.ROLE_STUDENT }]),

    // 6. user[6] is a disabled student
    ...utilFunctions.generateOneToMany('user', users[6]._id, [{ role: ids.ROLE_STUDENT }]),

    // 7. user[7] is an enabled parent
    ...utilFunctions.generateOneToMany('user', users[7]._id, [{ role: ids.ROLE_PARENT }]),

    // 8. user[8] is an enabled student
    ...utilFunctions.generateOneToMany('user', users[8]._id, [{ role: ids.ROLE_STUDENT }]),

    // 9. user[9] is an enabled student
    ...utilFunctions.generateOneToMany('user', users[9]._id, [{ role: ids.ROLE_STUDENT }]),

    // 10. user[10] is an enabled student
    ...utilFunctions.generateOneToMany('user', users[10]._id, [{ role: ids.ROLE_STUDENT }])

];

const classes = [

    // 0. user[0] has associated a sample class
    ...utilFunctions.generateOneToMany('user', users[0]._id, [
        modelFunctions.generateFakeClass({
            titleWords: 5,
            descriptionWords: 20,
            sessions: [[0, 20], [50, 80]]
        })
    ])

];

const classStudents = [

    ...utilFunctions.generateOneToMany('class', classes[0]._id, [

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

    ...utilFunctions.generateOneToMany('class', classes[0]._id, [

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

    ...utilFunctions.generateOneToMany('class', classes[0]._id, [

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
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: userRoles,
    [clazz.modelName]: classes,
    [classStudent.modelName]: classStudents,
    [classStudentInvitation.modelName]: classStudentInvitations,
    [classUnknownStudentInvitation.modelName]: classUnknownStudentInvitations
};
