const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const { sampleFiles } = require('../../shared');

// 0: generate one sample user
const users = models.generateFakeUsers(1, {
    fakeToken: true,
    noAvatar: true
});

const usersFiles = [
    // 0. user[0] will have associated a sample document file
    ...util.generateOneToMany('user', users[0]._id, [{ file: sampleFiles.documentFile }])
];

const storageUsersFiles = util.attachKeynames([
    // 0. sample document file associated to user[0]
    sampleFiles.documentFile
]);

module.exports = {

    db: {
        [db.names.user.modelName]: users,
        [db.names.userFile.modelName]: usersFiles
    },

    storage: {
        [db.names.userFile.modelName]: storageUsersFiles
    }

};
