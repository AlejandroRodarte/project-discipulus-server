const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClassStudents = persisted[db.names.classStudent.modelName];
const persistedSessions = persisted[db.names.session.modelName]

const sessionStudents = [

    // 0. unknown session with classStudent[2] (user[3], enabled)
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ classStudent: persistedClassStudents[2]._id }]),

    // session[0] with...
    ...util.generateOneToMany('session', persistedSessions[0]._id, [

        // 1. classStudent[0] (user[1], disabled)
        { classStudent: persistedClassStudents[0]._id },

        // 2. classStudent[1] (user[2], enabled, already associated to the session)
        { classStudent: persistedClassStudents[1]._id },

        // 3. classStudent[2] (user[3], enabled and unique)
        { classStudent: persistedClassStudents[2]._id }

    ])

];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents
};
