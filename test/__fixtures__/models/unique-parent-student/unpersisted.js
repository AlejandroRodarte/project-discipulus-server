const { Types } = require('mongoose');

const { parentStudent } = require('../../../../src/db/names');

const persisted = require('./persisted');

const [persistedParentStudent] = persisted[parentStudent.modelName];

const unpersisted = {

    [parentStudent.modelName]: [

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