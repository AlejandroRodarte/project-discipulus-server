const { Types } = require('mongoose');

const { sampleFile } = require('../../file/persisted');

module.exports = {
    _id: new Types.ObjectId(),
    name: 'Alejandro Rodarte',
    username: 'alex8850',
    email: 'alex@alex.com',
    password: 'My!$up3r.P4ssw0rd',
    tokens: [
        'super-token'
    ],
    avatar: sampleFile
};
