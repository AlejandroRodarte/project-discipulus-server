const { generateFakeFiles, generateFakeUsers } = require('../../functions/models');

const { user, userFile } = require('../../../../src/db/names');

const users = generateFakeUsers(1, { fakeToken: true });

const usersFiles = [
    {
        user: users[0]._id,
        file: generateFakeFiles(1)[0]
    }
];

module.exports = {
    [user.modelName]: users,
    [userFile.modelName]: usersFiles
};
