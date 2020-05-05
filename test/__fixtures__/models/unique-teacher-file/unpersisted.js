const { user, teacherFile } = require('../../../../src/db/names');

const { generateFakeFile } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedTeacherFiles = persisted[teacherFile.modelName];

const teacherFiles = [
    
    ...generateOneToMany('user', persistedUsers[0]._id, [

        // 0. different file for persisted user[0] but same original name
        // compared to already persisted one
        { 
            file: {
                ...generateFakeFile(),
                originalname: persistedTeacherFiles[0].file.originalname
            }
        },

        // 1. completely unique file for persisted user[0]
        {
            file: generateFakeFile()
        }
    ])

];

module.exports = {
    [teacherFile.modelName]: teacherFiles
};
