const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedClassStudents = persisted[db.names.classStudent.modelName];
const persistedClassStudentNotes = persisted[db.names.classStudentNote.modelName];

const classNotes = [
    ...util.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 0: classStudent[0] with note that has same tutle as classStudentNote[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedClassStudentNotes[0].note.title
            }
        },

        // 1: classStudent[0] with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.classStudentNote.modelName]: classNotes
};
