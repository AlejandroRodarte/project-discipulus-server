const { Types } = require('mongoose');

const { util } = require('../../functions');
const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const sessionFiles = [
    // 0: sample sessionFile with pdf file
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ file: sampleFiles.pdfFile }])
];

const storageSessionFiles = util.attachKeynames([
    // 0: pdf file owned by sessionFile[0]
    sampleFiles.pdfFile
]);

module.exports = {

    db: {
        [db.names.sessionFile.modelName]: sessionFiles
    },

    storage: {
        [db.names.sessionFile.modelName]: storageSessionFiles
    }

};
