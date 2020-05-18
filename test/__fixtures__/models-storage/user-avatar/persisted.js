const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

// 0-1: generate two fake users with no avatar
const users = models.generateFakeUsers(2, { 
    noAvatar: true,
    fakeToken: true
});

// user[1] will have associated a jpg avatar image
users[1].avatar = sampleFiles.jpgImage;

const userAvatars = util.attachKeynames([
    // 0. jpg image to persist to ibm cos
    sampleFiles.jpgImage
]);

module.exports = {

    db: {
        [db.names.user.modelName]: users
    },

    storage: {
        [db.names.user.modelName]: userAvatars
    }

};
