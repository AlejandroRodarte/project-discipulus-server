const { Types } = require('mongoose');

const { util } = require('../../functions');
const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const classFiles = [
    // 0: sample classFile with pdf file
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ file: sampleFiles.pdfFile }])
];

const storageClassFiles = util.attachKeynames([
    // 0: pdf file owned by classFile[0]
    sampleFiles.pdfFile
]);

module.exports = {

    db: {
        [db.names.classFile.modelName]: classFiles
    },

    storage: {
        [db.names.classFile.modelName]: storageClassFiles
    }

};
