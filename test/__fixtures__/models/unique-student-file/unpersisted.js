const { user, studentFile } = require('../../../../src/db/names');

const { generateFakeFile } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedStudentFiles = persisted[studentFile.modelName];

const studentFiles = [
    
    ...generateOneToMany('user', persistedUsers[0]._id, [

        // 0. different file for persisted user[0] but same original name
        // compared to already persisted one
        { 
            file: {
                ...generateFakeFile(),
                originalname: persistedStudentFiles[0].file.originalname
            }
        },

        // 1. completely unique file for persisted user[0]
        {
            file: generateFakeFile()
        }
    ])

];

module.exports = {
    [studentFile.modelName]: studentFiles
};
