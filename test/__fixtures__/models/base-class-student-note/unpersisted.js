const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClassStudents = persisted[db.names.classStudent.modelName];
const persistedClassStudentNotes = persisted[db.names.classStudentNote.modelName];

const classStudentNotes = [

    // 0. unknown class-student with note
    ...util.generateOneToMany('classStudent', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 1. classStudent[0] with note that has same title as classStudentNote[0] associated to classStudent[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedClassStudentNotes[0].note.title
            }
        },

        // 2. classStudent[0] with unique note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.classStudentNote.modelName]: classStudentNotes
};
