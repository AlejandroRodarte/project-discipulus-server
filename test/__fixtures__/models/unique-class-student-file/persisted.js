const { Types } = require('mongoose');
const { classStudent, classStudentFile } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const classStudents = [
    // 0: generate one sample class student
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0: generate one sample class student file
    ...utilFunctions.generateOneToMany('classStudent', classStudents[0]._id, [{ file: modelFunctions.generateFakeFile() }])
];

module.exports = {
    [classStudent.modelName]: classStudents,
    [classStudentFile.modelName]: classStudentFiles
};
