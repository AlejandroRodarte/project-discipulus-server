const { Types } = require('mongoose');
const faker = require('faker');

const utilFunctions = require('../../functions/util');

const { user, class: clazz, classUnknownStudentInvitation } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedClasses = persisted[clazz.modelName];
const persistedClassUnknownStudentInvitations = persisted[classUnknownStudentInvitation.modelName];

const classUnknownStudentInvitations = [

    // 0. unknown class with anonymous email user
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ email: faker.internet.email() }]),

    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 1. class[0] with email of an already invited, unknown user
        { 
            email: persistedClassUnknownStudentInvitations[0].email 
        },

        // 2. class[0] with new unknown user email
        { 
            email: faker.internet.email()
        },

        // 3. class[0] with new email of user[1] (disabled student)
        { 
            email: persistedUsers[1].email
        },

        // 4. class[0] with new email of user[2] (enabled parent)
        { 
            email: persistedUsers[2].email
        }

    ]),

    // 5. unknown class with user[5] (enabled student)
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ email: persistedUsers[5]._id }]),

    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 6. class[0] (user[0] is teacher) with user[0] (student)
        { 
            email: persistedUsers[0].email
        },

        // 7. class[0] with user[3] (already associated to class)
        { 
            email: persistedUsers[3].email
        },

        // 8. class[0] with user[4] (already has normal invitation)
        { 
            email: persistedUsers[4].email
        },

        // 9. class[0] with user[5] (valid for normal invitation)
        { 
            email: persistedUsers[5].email
        }

    ])

];

module.exports = {
    [classUnknownStudentInvitation.modelName]: classUnknownStudentInvitations
};
