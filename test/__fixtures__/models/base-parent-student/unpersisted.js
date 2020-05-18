const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];

const parentStudents = [
    
    // 0. user[2] (enabled parent/student) with user[2] (enabled parent/student)
    ...util.generateOneToMany('parent', persistedUsers[2]._id, [{ student: persistedUsers[2]._id }]),

    // 1. unknown parent with user[0] (enabled student)
    ...util.generateOneToMany('parent', new Types.ObjectId(), [{ student: persistedUsers[0]._id }]),

    // 2. user[1] (disabled parent) with user[0] (enabled student)
    ...util.generateOneToMany('parent', persistedUsers[1]._id, [{ student: persistedUsers[0]._id }]),

    // 3. user[3] (enabled student) with user[0] (enabled student)
    ...util.generateOneToMany('parent', persistedUsers[3]._id, [{ student: persistedUsers[0]._id }]),

    ...util.generateOneToMany('parent', persistedUsers[2]._id, [
        // 4. user[2] (enabled parent/student) with unknown user
        { 
            student: new Types.ObjectId() 
        },
        // 5. user[2] (enabled parent/student) with user[7] (disabled student)
        { 
            student: persistedUsers[7]._id
        },
        // 6. user[2] (enabled parent/student) with user[5] (enabled parent)
        { 
            student: persistedUsers[5]._id
        },
        // 7. user[2] (enabled parent/student) with user[4] (enabled parent/student)
        { 
            student: persistedUsers[4]._id
        },
        // 7. user[2] (enabled parent/student) with user[0] (enabled student, already associated)
        { 
            student: persistedUsers[0]._id
        },
        // 9. user[2] (enabled parent/student) with user[3] (enabled student)
        { 
            student: persistedUsers[3]._id
        }
    ])

];

const unpersisted = {
    [db.names.parentStudent.modelName]: parentStudents
};

module.exports = unpersisted;
