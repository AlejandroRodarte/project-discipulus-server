const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

// 0: generate one sample user
const users = models.generateFakeUsers(1, {
    fakeToken: true,
    noAvatar: true
});

const studentFiles = [
    // 0. user[0] will have associated a sample document file
    ...util.generateOneToMany('user', users[0]._id, [{ file: sampleFiles.documentFile }])
];

const storageStudentFiles = util.attachKeynames([
    // 0. sample document file associated to user[0]
    sampleFiles.zipFile
]);

module.exports = {

    db: {
        [db.names.user.modelName]: users,
        [db.names.studentFile.modelName]: studentFiles
    },

    storage: {
        [db.names.studentFile.modelName]: storageStudentFiles
    }

};
