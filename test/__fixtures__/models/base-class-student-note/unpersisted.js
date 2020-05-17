const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { classStudent, classStudentNote } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedClassStudents = persisted[classStudent.modelName];
const persistedClassStudentNotes = persisted[classStudentNote.modelName];

const classStudentNotes = [

    // 0. unknown class-student with note
    ...utilFunctions.generateOneToMany('classStudent', new Types.ObjectId(), [{ note: modelFunctions.generateFakeNote() }]),

    ...utilFunctions.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 1. classStudent[0] with note that has same title as classStudentNote[0] associated to classStudent[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedClassStudentNotes[0].note.title
            }
        },

        // 2. classStudent[0] with unique note
        { note: modelFunctions.generateFakeNote() }

    ])

];

module.exports = {
    [classStudentNote.modelName]: classStudentNotes
};
