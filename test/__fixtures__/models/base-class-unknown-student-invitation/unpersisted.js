const { Types } = require('mongoose');
const faker = require('faker');

const { util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedClasses = persisted[db.names.class.modelName];
const persistedClassUnknownStudentInvitations = persisted[db.names.classUnknownStudentInvitation.modelName];

const classUnknownStudentInvitations = [

    // 0. unknown class with anonymous email user
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ email: faker.internet.email() }]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

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
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ email: persistedUsers[5]._id }]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

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
    [db.names.classUnknownStudentInvitation.modelName]: classUnknownStudentInvitations
};
