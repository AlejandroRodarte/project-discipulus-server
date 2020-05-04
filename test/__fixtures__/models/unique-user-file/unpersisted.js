const { user, userFile } = require('../../../../src/db/names');

const { generateFakeFile } = require('../../../__fixtures__/functions/models');
const generateOneToMany = require('../../../__fixtures__/functions/util/generate-one-to-many');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedUsersFiles = persisted[userFile.modelName];

const usersFiles = [
    
    ...generateOneToMany('user', persistedUsers[0]._id, [

        // 0. different file for persisted user[0] but same original name
        // compared to already persisted one
        { 
            file: {
                ...generateFakeFile(),
                originalname: persistedUsersFiles[0].file.originalname
            }
        },

        // 1. completely unique file for persisted user[0]
        {
            file: generateFakeFile()
        }
    ])

];

module.exports = {
    [userFile.modelName]: usersFiles
};
