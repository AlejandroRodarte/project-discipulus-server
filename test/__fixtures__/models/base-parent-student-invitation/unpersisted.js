const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];

const parentStudentInvitations = [

    ...util.generateOneToMany('parent', persistedUsers[0]._id, [

        // 0: user[0] (enabled parent) with user[0] (enabled parent)
        { 
            student: persistedUsers[0]._id
        },

        // 1: user[0] (enabled parent) with unknown student
        {
            student: new Types.ObjectId()
        },

        // 2: user[0] (enabled parent) with user[1] (disabled student)
        {
            student: persistedUsers[1]._id
        },

        // 3: user[0] (enabled parent) with user[3] (enabled parent)
        {
            student: persistedUsers[3]._id
        }

    ]),
    
    // 4. unknown parent with user[2] (enabled parent/student)
    ...util.generateOneToMany('parent', new Types.ObjectId(), [{ student: persistedUsers[2]._id }]),

    // 5. user[7] (disabled parent) with user[2] (enabled parent/student)
    ...util.generateOneToMany('parent', persistedUsers[7]._id, [{ student: persistedUsers[2]._id }]),

    // 6. user[6] (enabled student) with user[2] (enabled parent/student)
    ...util.generateOneToMany('parent', persistedUsers[6]._id, [{ student: persistedUsers[2]._id }]),

    ...util.generateOneToMany('parent', persistedUsers[0]._id, [

        // 7. user[0] (enabled parent) with user[4] (enabled parent/student) which already is associated
        { 
            student: persistedUsers[4]._id 
        },

        // 8. user[0] (enabled parent) with user[2] (enabled parent/student) - already invited
        { 
            student: persistedUsers[2]._id 
        },

        // 9. user[0] (enabled parent) with user[6] (enabled student)
        { 
            student: persistedUsers[6]._id 
        }

    ])

];

module.exports = {
    [db.names.parentStudentInvitation.modelName]: parentStudentInvitations
};
