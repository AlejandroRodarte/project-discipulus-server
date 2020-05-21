const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedSessionStudents = persisted[db.names.sessionStudent.modelName];
const persistedSessionStudentNotes = persisted[db.names.sessionStudentNote.modelName];

const classStudentNotes = [

    // 0. unknown session-student with note
    ...util.generateOneToMany('sessionStudent', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('sessionStudent', persistedSessionStudents[0]._id, [

        // 1. sessionStudent[0] with note that has same title as sessionStudentNote[0] associated to sessionStudent[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedSessionStudentNotes[0].note.title
            }
        },

        // 2. sessionStudent[0] with unique note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.sessionStudentNote.modelName]: classStudentNotes
};
