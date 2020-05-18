const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const classStudentFiles = [
    // 0: sample classStudentFile with sheet file
    ...util.generateOneToMany('classStudent', new Types.ObjectId(), [{ file: sampleFiles.sheetFile }])
];

const storageClassStudentFiles = util.attachKeynames([
    // 0: sheet file associated to classStudentFile[0]
    sampleFiles.sheetFile
]);

module.exports = {

    db: {
        [db.names.classStudentFile.modelName]: classStudentFiles
    },

    storage: {
        [db.names.classStudentFile.modelName]: storageClassStudentFiles
    }

};
