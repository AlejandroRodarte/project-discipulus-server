const { generateFakeFile } = require('../../functions/models');

const { user, studentFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];

const studentsFiles = [
    
    // 0. persisted user[0] (student) with another file
    {
        user: persistedUsers[0]._id,
        file: generateFakeFile()
    }

];

module.exports = {
    [studentFile.modelName]: studentsFiles
};