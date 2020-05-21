const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const sessionStudents = [
    // 0: sample session student
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ classStudent: new Types.ObjectId() }])
];

const sessionStudentFiles = [
    // 0: sessionStudent[0] associated with pptx file
    ...util.generateOneToMany('sessionStudent', sessionStudents[0]._id, [{ file: sampleFiles.presentationFile }])
];

const storageSessionStudentFiles = util.attachKeynames([
    // 0: pptx file that associates sessionStudent[0] with sessionStudentFile[0]
    sampleFiles.presentationFile
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
