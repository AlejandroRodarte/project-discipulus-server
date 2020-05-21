const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { util } = require('../../functions');

const persisted = require('./persisted');

const persistedSessionStudents = persisted[db.names.sessionStudent.modelName];

const sessionStudents = [

    ...util.generateOneToMany('classStudent', persistedSessionStudents[0].classStudent, [

        // 0. same classStudent/session combo as sessionStudent[0]
        { session: persistedSessionStudents[0].session },

        // 1. same classStudent, different session
        { session: new Types.ObjectId() }

    ]),

    ...util.generateOneToMany('classStudent', new Types.ObjectId(), [

        // 2. same session, different classStudent
        { session: persistedSessionStudents[0].session },

        // 3. different session and classStudent
        { session: new Types.ObjectId() }

    ])
    
];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents
};
