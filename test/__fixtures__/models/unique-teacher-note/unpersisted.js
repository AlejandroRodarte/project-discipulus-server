const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedTeacherNotes = persisted[db.names.teacherNote.modelName];

const teacherNotes = [
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] as teacher with note that has same title as teacherNote[0]
        { 
            note: {
                ...models.generateFakeNote(),
                title: persistedTeacherNotes[0].note.title
            }
        },

        // 1. user[0] as teacher with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.teacherNote.modelName]: teacherNotes
};
