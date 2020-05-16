const { class: clazz, classFile } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedClasses = persisted[clazz.modelName];
const persistedClassFiles = persisted[classFile.modelName];

const classFiles = [
    
    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 0. class[0] with a second file with same originalname as classFile[0]
        {
            file: {
                ...modelFunctions.generateFakeFile(),
                originalname: persistedClassFiles[0].file.originalname
            }
        },

        // 1. class[0] with unique file
        { file: modelFunctions.generateFakeFile() }
        
    ])

];

module.exports = {
    [classFile.modelName]: classFiles
};
