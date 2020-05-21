const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const sessionStudents = [
    // 0. sample session student
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ classStudent: new Types.ObjectId() }])
];

const sessionStudentFiles = [
    // 0. sessionStudent[0] has sample sheet file
    ...util.generateOneToMany('sessionStudent', sessionStudents[0]._id, [{ file: sampleFiles.sheetFile }])
];

const storageSessionStudentFiles = util.attachKeynames([
    // 0. sheet file associated to sessionStudentFile[0]
    sampleFiles.sheetFile
]);

module.exports = {

    db: {
        [db.names.sessionStudent.modelName]: sessionStudents,
        [db.names.sessionStudentFile.modelName]: sessionStudentFiles
    },

    storage: {
        [db.names.sessionStudentFile.modelName]: storageSessionStudentFiles
    }

};
