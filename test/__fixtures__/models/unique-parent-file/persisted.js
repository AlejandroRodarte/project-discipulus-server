const { user, parentFile } = require('../../../../src/db/names');

const { generateFakeFile, generateFakeUsers } = require('../../../__fixtures__/functions/models');
const generateOneToMany = require('../../../__fixtures__/functions/util/generate-one-to-many');

// 0: generate one sample user
const users = generateFakeUsers(1, { fakeToken: true });

const parentFiles = [
    // 0: user[0] will have associated one file as a parent (no role required)
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }])
];

module.exports = {
    [user.modelName]: users,
    [parentFile.modelName]: parentFiles
};
