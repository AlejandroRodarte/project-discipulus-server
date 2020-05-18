const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

// 0: generate one sample user
const users = models.generateFakeUsers(1, { fakeToken: true });

const usersFiles = [
    // 0: user[0] will have associated one file
    ...util.generateOneToMany('user', users[0]._id, [{ file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.userFile.modelName]: usersFiles
};
