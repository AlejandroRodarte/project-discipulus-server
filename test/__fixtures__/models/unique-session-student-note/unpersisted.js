const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedSessionStudents = persisted[db.names.sessionStudent.modelName];
const persistedSessionStudentNotes = persisted[db.names.sessionStudentNote.modelName];

const sessionStudentNotes = [
    ...util.generateOneToMany('sessionStudent', persistedSessionStudents[0]._id, [

        // 0: sessionStudent[0] with note that has same tutle as sessionStudentNote[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedSessionStudentNotes[0].note.title
            }
        },

        // 1: sessionStudent[0] with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.sessionStudentNote.modelName]: sessionStudentNotes
};
