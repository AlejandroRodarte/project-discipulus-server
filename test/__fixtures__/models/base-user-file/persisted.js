const { generateFakeFile, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { user, userFile } = require('../../../../src/db/names');

// 1: generate 1 enabled user
const users = generateFakeUsers(1, { fakeToken: true });

const usersFiles = [
    // 0-1: user[0] with two files
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }, { file: generateFakeFile() }]),
];

module.exports = {
    [user.modelName]: users,
    [userFile.modelName]: usersFiles
};
