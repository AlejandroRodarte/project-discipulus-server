const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedUsersFiles = persisted[db.names.userFile.modelName];

const usersFiles = [
    
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. different file for persisted user[0] but same original name
        // compared to already persisted one
        { 
            file: {
                ...models.generateFakeFile(),
                originalname: persistedUsersFiles[0].file.originalname
            }
        },

        // 1. completely unique file for persisted user[0]
        {
            file: models.generateFakeFile()
        }
    ])

];

module.exports = {
    [db.names.userFile.modelName]: usersFiles
};
