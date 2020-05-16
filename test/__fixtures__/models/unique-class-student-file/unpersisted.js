const { classStudent, classStudentFile } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedClassStudents = persisted[classStudent.modelName];
const persistedClassStudentFiles = persisted[classStudentFile.modelName];

const classStudentFiles = [
    
    ...utilFunctions.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 0. classStudent[0] with a second file with same originalname as classStudentFile[0]
        {
            file: {
                ...modelFunctions.generateFakeFile(),
                originalname: persistedClassStudentFiles[0].file.originalname
            }
        },

        // 1. classStudent[0] with unique file
        { file: modelFunctions.generateFakeFile() }
        
    ])

];

module.exports = {
    [classStudentFile.modelName]: classStudentFiles
};
