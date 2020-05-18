const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const classStudents = [
    // 0: sample class student
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0-1: classStudent[0] with two files
    ...util.generateOneToMany('classStudent', classStudents[0]._id, [{ file: models.generateFakeFile() }, { file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.classStudent.modelName]: classStudents,
    [db.names.classStudentFile.modelName]: classStudentFiles
};
