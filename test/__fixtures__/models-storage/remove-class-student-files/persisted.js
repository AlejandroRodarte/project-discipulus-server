const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const classStudents = [
    // 0: sample class student
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0: classStudent[0] associated with pptx file
    ...util.generateOneToMany('classStudent', classStudents[0]._id, [{ file: sampleFiles.presentationFile }])
];

const storageClassStudentFiles = util.attachKeynames([
    // 0: pptx file that associates classStudent[0] with classStudentFile[0]
    sampleFiles.presentationFile
]);

module.exports = {

    db: {
        [db.names.classStudent.modelName]: classStudents,
        [db.names.classStudentFile.modelName]: classStudentFiles
    },

    storage: {
        [db.names.classStudentFile.modelName]: storageClassStudentFiles
    }

};
