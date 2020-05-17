const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const shared = require('../../shared');

const { class: clazz, classFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedClasses = persisted.db[clazz.modelName];

const classFiles = [
    
    // 0. unknown class with pdf file
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ file: shared.sampleFiles.pdfFile }]),

    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 1. class[0] with doc file (already persisted, non-unique)
        { file: shared.sampleFiles.documentFile },

        // 2. class[0] with zip file (unique)
        { file: shared.sampleFiles.zipFile }

    ]),

];

module.exports = {
    db: {
        [classFile.modelName]: classFiles
    }
};