const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedSessionStudents = persisted[db.names.sessionStudent.modelName];
const persistedSessionStudentFiles = persisted[db.names.sessionStudentFile.modelName];

const sessionStudentFiles = [
    
    ...util.generateOneToMany('sessionStudent', persistedSessionStudents[0]._id, [

        // 0. sessionStudent[0] with a second file with same originalname as sessionStudentFile[0]
        {
            file: {
                ...models.generateFakeFile(),
                originalname: persistedSessionStudentFiles[0].file.originalname
            }
        },

        // 1. sessionStudent[0] with unique file
        { file: models.generateFakeFile() }
        
    ])

];

module.exports = {
    [db.names.sessionStudentFile.modelName]: sessionStudentFiles
};
