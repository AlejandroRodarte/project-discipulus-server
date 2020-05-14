const { Types } = require('mongoose');

const utilFunctions = require('../../functions/util');

const { user, class: clazz, classStudentInvitation } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedClasses = persisted[clazz.modelName]

const classStudentInvitations = [

    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 0. class[0] with unknown student
        {
            user: new Types.ObjectId()
        },

        // 1. class[0] with user[1] (disabled student)
        {
            user: persistedUsers[1]._id
        },

        // 2. user[0] with user[2] (enabled parent)
        {
            user: persistedUsers[2]._id
        }

    ]),

    // 3. unknown class with user[5] (enabled student)
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: persistedUsers[5]._id }]),

    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 4. class[0] (user[0] is teacher) with user[0] (also a student)
        {
            user: persistedUsers[0]._id
        },

        // 5. class[0] with user[3] (already registered)
        {
            user: persistedUsers[3]._id   
        },

        // 6. class[0] with user[4] (already invited)
        {
            user: persistedUsers[4]._id   
        },

        // 7. class[0] with user[5] (valid)
        {
            user: persistedUsers[5]._id   
        }

    ])

];

module.exports = {
    [classStudentInvitation.modelName]: classStudentInvitations
};
