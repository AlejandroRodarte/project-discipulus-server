const { user, teacherNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedTeacherNotes = persisted[teacherNote.modelName];

const teacherNotes = [
    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] as teacher with note that has same title as teacherNote[0]
        { 
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedTeacherNotes[0].note.title
            }
        },

        // 1. user[0] as teacher with unique note
        { note: modelFunctions.generateFakeNote() }

    ])
];

module.exports = {
    [teacherNote.modelName]: teacherNotes
};
