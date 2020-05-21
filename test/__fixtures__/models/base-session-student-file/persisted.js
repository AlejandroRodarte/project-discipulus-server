const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const sessionStudents = [
    // 0: sample session student
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ sessionStudent: new Types.ObjectId() }])
];

const sessionStudentFiles = [
    // 0-1: sessionStudent[0] with two files
    ...util.generateOneToMany('sessionStudent', sessionStudents[0]._id, [{ file: models.generateFakeFile() }, { file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents,
    [db.names.classStudentFile.modelName]: sessionStudentFiles
};
