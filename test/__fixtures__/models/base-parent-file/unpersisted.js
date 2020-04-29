const { generateFakeFile } = require('../../functions/models');

const { user, parentFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];

const parentsFiles = [
    
    // 0. persisted user[0] (parent) with another file
    {
        user: persistedUsers[0]._id,
        file: generateFakeFile()
    }

];

module.exports = {
    [parentFile.modelName]: parentsFiles
};