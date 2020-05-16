const { Types } = require('mongoose');
const { classStudent, classStudentNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const classStudents = [
    // 0: generate one sample class student
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentNotes = [
    // 0: classStudent[0] with sample note
    ...utilFunctions.generateOneToMany('classStudent', classStudents[0]._id, [{ note: modelFunctions.generateFakeNote() }])
];

module.exports = {
    [classStudent.modelName]: classStudents,
    [classStudentNote.modelName]: classStudentNotes
};
