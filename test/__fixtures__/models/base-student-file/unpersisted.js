const { models } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];

const studentsFiles = [
    
    // 0. persisted user[0] (student) with another file
    {
        user: persistedUsers[0]._id,
        file: models.generateFakeFile()
    }

];

module.exports = {
    [db.names.studentFile.modelName]: studentsFiles
};