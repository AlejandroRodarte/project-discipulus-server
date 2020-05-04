const { user, userFile } = require('../../../../src/db/names');

const { generateFakeFile, generateFakeUsers } = require('../../../__fixtures__/functions/models');
const generateOneToMany = require('../../../__fixtures__/functions/util/generate-one-to-many');

// 0: generate one sample user
const users = generateFakeUsers(1, { fakeToken: true });

const usersFiles = [
    // 0: user[0] will have associated one file
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }])
];

module.exports = {
    [user.modelName]: users,
    [userFile.modelName]: usersFiles
};
