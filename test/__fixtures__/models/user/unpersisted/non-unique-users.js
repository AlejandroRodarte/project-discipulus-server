const sampleUser = require('../persisted/sample-user');
const uniqueUsers = require('./unique-users');

const baseUser = uniqueUsers[0];

const nonUniqueUsers = {

    nonUniqueName: {
        ...baseUser,
        name: sampleUser.name
    },

    nonUniqueUsername: {
        ...baseUser,
        username: sampleUser.username
    },

    nonUniqueEmail: {
        ...baseUser,
        email: sampleUser.email
    },

    nonUniqueAvatarKeyname: {
        ...baseUser,
        avatar: {
            ...baseUser.avatar,
            keyname: sampleUser.avatar.keyname
        }
    }

};

module.exports = nonUniqueUsers;
