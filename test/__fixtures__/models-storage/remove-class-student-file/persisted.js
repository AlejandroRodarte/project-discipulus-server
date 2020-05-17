const { Types } = require('mongoose');

const utilFunctions = require('../../functions/util');

const shared = require('../../shared');

const { classStudentFile } = require('../../../../src/db/names');

const classStudentFiles = [
    // 0: sample classStudentFile with sheet file
    ...utilFunctions.generateOneToMany('classStudent', new Types.ObjectId(), [{ file: shared.sampleFiles.sheetFile }])
];

const storageClassStudentFiles = utilFunctions.attachKeynames([
    // 0: sheet file associated to classStudentFile[0]
    shared.sampleFiles.sheetFile
]);

module.exports = {

    db: {
        [classStudentFile.modelName]: classStudentFiles
    },

    storage: {
        [classStudentFile.modelName]: storageClassStudentFiles
    }

};
