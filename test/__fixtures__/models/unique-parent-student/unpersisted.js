const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const [persistedParentStudent] = persisted[db.names.parentStudent.modelName];

const unpersisted = {

    [db.names.parentStudent.modelName]: [

        // 0. same parent id but unique student id
        {
            parent: persistedParentStudent.parent,
            student: new Types.ObjectId()
        },

        // 1. same student id but unique parent id
        {
            parent: new Types.ObjectId(),
            student: persistedParentStudent.student
        },

        // 2. different student id and parent id
        {
            parent: new Types.ObjectId(),
            student: new Types.ObjectId()
        },

        // 3. same parent/student id combo
        {
            parent: persistedParentStudent.parent,
            student: persistedParentStudent.student
        }

    ]

};

module.exports = unpersisted;