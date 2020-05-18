const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClasses = persisted.db[db.names.class.modelName];

const classFiles = [
    
    // 0. unknown class with pdf file
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ file: sampleFiles.pdfFile }]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 1. class[0] with doc file (already persisted, non-unique)
        { file: sampleFiles.documentFile },

        // 2. class[0] with zip file (unique)
        { file: sampleFiles.zipFile }

    ]),

];

module.exports = {
    db: {
        [db.names.classFile.modelName]: classFiles
    }
};