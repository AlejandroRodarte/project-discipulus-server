const { generateFakeFile } = require('../../functions/models');

const { user, teacherFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];

const teachersFiles = [
    
    // 0. persisted user[0] (student) with another file
    {
        user: persistedUsers[0]._id,
        file: generateFakeFile()
    }

];

module.exports = {
    [teacherFile.modelName]: teachersFiles
};