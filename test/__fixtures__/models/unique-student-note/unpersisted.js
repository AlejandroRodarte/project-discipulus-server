const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedStudentNotes = persisted[db.names.studentNote.modelName];

const studentNotes = [
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] as student with note that has same title as studentNote[0]
        { 
            note: {
                ...models.generateFakeNote(),
                title: persistedStudentNotes[0].note.title
            }
        },

        // 1. user[0] as student with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.studentNote.modelName]: studentNotes
};
