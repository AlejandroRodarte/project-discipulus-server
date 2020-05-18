const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedClassStudents = persisted[db.names.classStudent.modelName];
const persistedClassStudentFiles = persisted[db.names.classStudentFile.modelName];

const classStudentFiles = [
    
    ...util.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 0. classStudent[0] with a second file with same originalname as classStudentFile[0]
        {
            file: {
                ...models.generateFakeFile(),
                originalname: persistedClassStudentFiles[0].file.originalname
            }
        },

        // 1. classStudent[0] with unique file
        { file: models.generateFakeFile() }
        
    ])

];

module.exports = {
    [db.names.classStudentFile.modelName]: classStudentFiles
};
