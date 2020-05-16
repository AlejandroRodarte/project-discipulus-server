const { user, studentNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedStudentNotes = persisted[studentNote.modelName];

const studentNotes = [
    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] as student with note that has same title as studentNote[0]
        { 
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedStudentNotes[0].note.title
            }
        },

        // 1. user[0] as student with unique note
        { note: modelFunctions.generateFakeNote() }

    ])
];

module.exports = {
    [studentNote.modelName]: studentNotes
};
