const generateFakeUsers = require('../../functions/models/generate-fake-users');
const attachKeynames = require('../../functions/util/attach-keynames');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const sampleFiles = require('../../shared/sample-files');
const { user, userFile } = require('../../../../src/db/names');

const users = [

    // 0: disabled user
    ...generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
        noAvatar: true
    }),

    // 1: enabled user
    ...generateFakeUsers(1, {
        fakeToken: true,
        noAvatar: true
    }),

];

const usersFiles = [
    // 0. user[1] will have associated a sample pptx file
    ...generateOneToMany('user', users[1]._id, [{ file: sampleFiles.presentationFile }])
];

const storageUsersFiles = attachKeynames([
    // 0. sample pptx file associated to user[1]
    sampleFiles.presentationFile
]);

module.exports = {

    db: {
        [user.modelName]: users,
        [userFile.modelName]: usersFiles
    },

    storage: {
        [userFile.modelName]: storageUsersFiles
    }

};
