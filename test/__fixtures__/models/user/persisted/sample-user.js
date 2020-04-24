const { Types } = require('mongoose');

module.exports = {
    _id: new Types.ObjectId(),
    name: 'Alejandro Rodarte',
    username: 'alex8850',
    email: 'alex@alex.com',
    password: 'My!$up3r.P4ssw0rd',
    tokens: [
        'super-token'
    ],
    avatar: {
        originalname: 'my-image.png',
        mimetype: 'image/png'
    }
};
