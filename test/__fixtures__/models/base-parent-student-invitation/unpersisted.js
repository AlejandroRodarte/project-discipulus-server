const { parentStudentInvitation, user } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedParentStudentInvitations = persisted[parentStudentInvitation.modelName];
const persistedUsers = persisted[user.modelName];

const unpersisted = {

    [parentStudent.modelName]: [

        // 0. same parent/student id combo against persisted one
        {
            parent: persistedParentStudentInvitations[0].parent,
            student: persistedParentStudentInvitations[0].student
        },

        // 1. user four (parent, enabled) with user three (student)
        {
            parent: persistedUsers[3]._id,
            student: persistedUsers[2]._id
        }

    ]

};

module.exports = unpersisted;
