const { parentStudent, user } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedParentStudents = persisted[parentStudent.modelName];
const persistedUsers = persisted[user.modelName];

const unpersisted = {

    [parentStudent.modelName]: [

        // 0. same parent/student id combo against persisted one
        {
            parent: persistedParentStudents[0].parent,
            student: persistedParentStudents[0].student
        },

        // 1. user three (parent, enabled) with user four (student)
        {
            parent: persistedUsers[2]._id,
            student: persistedUsers[3]._id
        }

    ]

};

module.exports = unpersisted;
