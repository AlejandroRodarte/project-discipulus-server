const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { classStudent, classStudentNote } = require('../../../../src/db/names');

const classStudents = [
    // 0: sample class student
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentNotes = [
    // 0-1: classStudent[0] with two notes
    ...utilFunctions.generateOneToMany('classStudent', classStudents[0]._id, [{ note: modelFunctions.generateFakeNote() }, { note: modelFunctions.generateFakeNote() }])
];

module.exports = {
    [classStudent.modelName]: classStudents,
    [classStudentNote.modelName]: classStudentNotes
};
