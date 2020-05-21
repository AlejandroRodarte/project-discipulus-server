const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const sessionStudentFiles = [
    // 0: sample sessionStudentFile with sheet file
    ...util.generateOneToMany('sessionStudent', new Types.ObjectId(), [{ file: sampleFiles.sheetFile }])
];

const storageSessionStudentFiles = util.attachKeynames([
    // 0: sheet file associated to sessionStudentFile[0]
    sampleFiles.sheetFile
]);

module.exports = {

    db: {
        [db.names.sessionStudentFile.modelName]: sessionStudentFiles
    },

    storage: {
        [db.names.sessionStudentFile.modelName]: storageSessionStudentFiles
    }

};
