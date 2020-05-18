const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const users = [

    // 0: disabled user
    ...models.generateFakeUsers(1, {
        enabled: false,
        fakeToken: true,
        noAvatar: true
    }),

    // 1: enabled user
    ...models.generateFakeUsers(1, {
        fakeToken: true,
        noAvatar: true
    }),

];

const usersFiles = [
    // 0. user[1] will have associated a sample pptx file
    ...util.generateOneToMany('user', users[1]._id, [{ file: sampleFiles.presentationFile }])
];

const storageUsersFiles = util.attachKeynames([
    // 0. sample pptx file associated to user[1]
    sampleFiles.presentationFile
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
