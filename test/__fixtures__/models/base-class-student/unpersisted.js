const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedClasses = persisted[db.names.class.modelName]

const classStudents = [

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

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

    // 3. unknown class with user[4] (enabled student)
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: persistedUsers[4]._id }]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 4. class[0] (user[0] is teacher) with user[0] (also a student)
        {
            user: persistedUsers[0]._id
        },

        // 5. class[0] with user[5] (not invited)
        {
            user: persistedUsers[5]._id   
        },

        // 6. class[0] with user[3] (invited but already registered, not possible but still covered)
        {
            user: persistedUsers[3]._id   
        },

        // 7. class[0] with user[4] (valid)
        {
            user: persistedUsers[4]._id   
        }

    ]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 8. class[0] with unknown student
        {
            user: new Types.ObjectId()
        },

        // 9. class[0] with user[6] (disabled student)
        {
            user: persistedUsers[6]._id
        },

        // 10. user[0] with user[7] (enabled parent)
        {
            user: persistedUsers[7]._id
        }

    ]),

    // 11. unknown class with user[9] (enabled student)
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: persistedUsers[9]._id }]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 12. class[0] (user[0] is teacher) with user[0] (also a student)
        {
            user: persistedUsers[0]._id
        },

        // 13. class[0] with user[10] (not invited)
        {
            user: persistedUsers[10]._id   
        },

        // 14. class[0] with user[8] (invited but already registered, not possible but still covered)
        {
            user: persistedUsers[8]._id   
        },

        // 15. class[0] with user[9] (valid)
        {
            user: persistedUsers[9]._id   
        }

    ]),

];

module.exports = {
    [db.names.classStudent.modelName]: classStudents
};
