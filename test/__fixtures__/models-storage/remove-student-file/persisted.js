const generateFakeUsers = require('../../functions/models/generate-fake-users');
const attachKeynames = require('../../functions/util/attach-keynames');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const sampleFiles = require('../../shared/sample-files');
const { user, studentFile } = require('../../../../src/db/names');

// 0: generate one sample user
const users = generateFakeUsers(1, {
    fakeToken: true,
    noAvatar: true
});

const studentFiles = [
    // 0. user[0] will have associated a sample document file
    ...generateOneToMany('user', users[0]._id, [{ file: sampleFiles.documentFile }])
];

const storageStudentFiles = attachKeynames([
    // 0. sample document file associated to user[0]
    sampleFiles.zipFile
]);

module.exports = {

    db: {
        [user.modelName]: users,
        [studentFile.modelName]: studentFiles
    },

    storage: {
        [studentFile.modelName]: storageStudentFiles
    }

};
