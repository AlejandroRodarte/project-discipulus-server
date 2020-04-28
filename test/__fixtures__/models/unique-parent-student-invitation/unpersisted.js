const { Types } = require('mongoose');

const { parentStudentInvitation } = require('../../../../src/db/names');

const persisted = require('./persisted');

const [persistedParentStudentInvitation] = persisted[parentStudentInvitation.modelName];

const unpersisted = {

    [parentStudentInvitation.modelName]: [

        // 0. same parent id but unique student id
        {
            parent: persistedParentStudentInvitation.parent,
            student: new Types.ObjectId()
        },

        // 1. same student id but unique parent id
        {
            parent: new Types.ObjectId(),
            student: persistedParentStudentInvitation.student
        },

        // 2. different student id and parent id
        {
            parent: new Types.ObjectId(),
            student: new Types.ObjectId()
        },

        // 3. same parent/student id combo
        {
            parent: persistedParentStudentInvitation.parent,
            student: persistedParentStudentInvitation.student
        }

    ]

};

module.exports = unpersisted;