const sampleUser = require('../persisted/sample-user');

const baseUser = {
    name: 'Patricia Mendoza',
    username: 'paty85',
    email: 'paty@paty.com',
    password: '$2y$12$tSdQuHVlw0TP6o1Mx33VNurXgl1KSi3p0DaXOcfkDdz77F6PF2PAK',
    tokens: [
        'super-token'
    ],
    avatar: {
        originalname: 'my-avatar.jpg',
        mimetype: 'image/jpg',
        keyname: '2c5ea4c0-4067-11e9-8b2d-1b9d6bcdbbfd.jpg'
    }
};

const nonUniqueUsers = {

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
