const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedClasses = persisted[db.names.class.modelName];
const persistedClassFiles = persisted[db.names.classFile.modelName];

const classFiles = [
    
    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 0. class[0] with a second file with same originalname as classFile[0]
        {
            file: {
                ...models.generateFakeFile(),
                originalname: persistedClassFiles[0].file.originalname
            }
        },

        // 1. class[0] with unique file
        { file: models.generateFakeFile() }
        
    ])

];

module.exports = {
    [db.names.classFile.modelName]: classFiles
};
