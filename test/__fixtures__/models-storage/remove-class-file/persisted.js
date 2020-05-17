const { Types } = require('mongoose');

const utilFunctions = require('../../functions/util');
const shared = require('../../shared');

const { classFile } = require('../../../../src/db/names');

const classFiles = [
    // 0: sample classFile with pdf file
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ file: shared.sampleFiles.pdfFile }])
];

const storageClassFiles = utilFunctions.attachKeynames([
    // 0: pdf file owned by classFile[0]
    shared.sampleFiles.pdfFile
]);

module.exports = {

    db: {
        [classFile.modelName]: classFiles
    },

    storage: {
        [classFile.modelName]: storageClassFiles
    }

};
