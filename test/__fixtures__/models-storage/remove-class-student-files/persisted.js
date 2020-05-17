const { Types } = require('mongoose');

const utilFunctions = require('../../functions/util');

const shared = require('../../shared');

const { classStudent, classStudentFile } = require('../../../../src/db/names');

const classStudents = [
    // 0: sample class student
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0: classStudent[0] associated with pptx file
    ...utilFunctions.generateOneToMany('classStudent', classStudents[0]._id, [{ file: shared.sampleFiles.presentationFile }])
];

const storageClassStudentFiles = utilFunctions.attachKeynames([
    // 0: pptx file that associates classStudent[0] with classStudentFile[0]
    shared.sampleFiles.presentationFile
]);

module.exports = {

    db: {
        [classStudent.modelName]: classStudents,
        [classStudentFile.modelName]: classStudentFiles
    },

    storage: {
        [classStudentFile.modelName]: storageClassStudentFiles
    }

};
