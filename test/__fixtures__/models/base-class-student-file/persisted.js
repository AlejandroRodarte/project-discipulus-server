const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { classStudent, classStudentFile } = require('../../../../src/db/names');

const classStudents = [
    // 0: sample class student
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0-1: classStudent[0] with two files
    ...utilFunctions.generateOneToMany('classStudent', classStudents[0]._id, [{ file: modelFunctions.generateFakeFile() }, { file: modelFunctions.generateFakeFile() }])
];

module.exports = {
    [classStudent.modelName]: classStudents,
    [classStudentFile.modelName]: classStudentFiles
};
