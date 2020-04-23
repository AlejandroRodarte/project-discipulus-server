const { Types } = require('mongoose');

module.exports = {
    _id: new Types.ObjectId(),
    name: 'Alejandro Rodarte',
    username: 'alex8850',
    email: 'alex@alex.com',
    password: '$2y$12$tSdQuHVlw0TP6o1Mx33VNurXgl1KSi3p0DaXOcfkDdz77F6PF2PAK',
    tokens: [
        'super-token'
    ],
    avatar: {
        originalname: 'my-image.png',
        mimetype: 'image/png',
        keyname: '2c5ea4c0-4067-11e9-8b2d-1b9d6bcdbbfd.png'
    }
};
