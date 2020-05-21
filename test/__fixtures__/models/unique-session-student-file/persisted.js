const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const sessionStudents = [
    // 0: generate one sample session student
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ classStudent: new Types.ObjectId() }])
];

const sessionStudentFiles = [
    // 0: generate one sample session student file
    ...util.generateOneToMany('sessionStudent', sessionStudents[0]._id, [{ file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents,
    [db.names.sessionStudentFile.modelName]: sessionStudentFiles
};
