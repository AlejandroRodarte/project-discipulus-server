const { Types } = require('mongoose');

const utilFunctions = require('../../functions/util');

const shared = require('../../shared');

const { classStudent, classStudentFile } = require('../../../../src/db/names');

const classStudents = [
    // 0. sample class student
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentFiles = [
    // 0. classStudent[0] has sample sheet file
    ...utilFunctions.generateOneToMany('classStudent', classStudents[0]._id, [{ file: shared.sampleFiles.sheetFile }])
];

const storageClassFiles = utilFunctions.attachKeynames([
    // 0. sheet file associated to classStudentFile[0]
    shared.sampleFiles.sheetFile
]);

module.exports = {

    db: {
        [classStudent.modelName]: classStudents,
        [classStudentFile.modelName]: classStudentFiles
    },

    storage: {
        [classStudentFile.modelName]: storageClassFiles
    }

};
