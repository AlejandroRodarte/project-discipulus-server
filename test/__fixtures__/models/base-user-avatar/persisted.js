const { user } = require('../../../../src/db/names');

const sampleFiles = require('../../shared/sample-files');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const users = [
    ...generateFakeUsers(1),
    ...generateFakeUsers(1, { noAvatar: true })
];

users[1].avatar = sampleFiles.jpgImage;

module.exports = {

    db: {

    },

    storage: {

    }

};