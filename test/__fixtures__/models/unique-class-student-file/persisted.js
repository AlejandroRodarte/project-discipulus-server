const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const classStudents = [
    // 0: generate one sample class student
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0: generate one sample class student file
    ...util.generateOneToMany('classStudent', classStudents[0]._id, [{ file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.classStudent.modelName]: classStudents,
    [db.names.classStudentFile.modelName]: classStudentFiles
};
