const { user, studentFile } = require('../../../../src/db/names');

const { generateFakeFile, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

// 0: generate one sample user
const users = generateFakeUsers(1, { fakeToken: true });

const studentFiles = [
    // 0: user[0] will have associated one file as a student (no role required)
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }])
];

module.exports = {
    [user.modelName]: users,
    [studentFile.modelName]: studentFiles
};
