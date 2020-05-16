const { classStudent, classStudentNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedClassStudents = persisted[classStudent.modelName];
const persistedClassStudentNotes = persisted[classStudentNote.modelName];

const classNotes = [
    ...utilFunctions.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 0: classStudent[0] with note that has same tutle as classStudentNote[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedClassStudentNotes[0].note.title
            }
        },

        // 1: classStudent[0] with unique note
        { note: modelFunctions.generateFakeNote() }

    ])
];

module.exports = {
    [classStudentNote.modelName]: classNotes
};
