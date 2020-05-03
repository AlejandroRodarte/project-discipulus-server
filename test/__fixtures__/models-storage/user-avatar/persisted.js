const generateFakeUsers = require('../../functions/models/generate-fake-users');
const attachKeynames = require('../../functions/util/attach-keynames');

const sampleFiles = require('../../shared/sample-files');
const { user } = require('../../../../src/db/names');

// 0-1: generate two fake users with no avatar
const users = generateFakeUsers(2, { 
    noAvatar: true,
    fakeToken: true
});

// user[1] will have associated a jpg avatar image
users[1].avatar = sampleFiles.jpgImage;

const userAvatars = attachKeynames([
    // 0. jpg image to persist to ibm cos
    sampleFiles.jpgImage
]);

module.exports = {

    db: {
        [user.modelName]: users
    },

    storage: {
        [user.modelName]: userAvatars
    }

};
