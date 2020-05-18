const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

// 0: generate 1 enabled user
const users = models.generateFakeUsers(1, { fakeToken: true });

const usersFiles = [
    // 0-1: user[0] with two files
    ...util.generateOneToMany('user', users[0]._id, [{ file: models.generateFakeFile() }, { file: models.generateFakeFile() }]),
];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.userFile.modelName]: usersFiles
};
