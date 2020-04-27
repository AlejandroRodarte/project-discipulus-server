const jwt = require('jsonwebtoken');
const faker = require('faker');
const { Types } = require('mongoose');

const generateFakeUsers = (amount, enabled) => {

    const userIds = [...new Array(amount)].map(_ => new Types.ObjectId());

    const users = userIds.map(_id => ({
        _id: new Types.ObjectId(),
        name: faker.name.findName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: '$s4tic!paSsw0rd',
        tokens: [
            jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME })
        ],
        avatar: {
            originalname: faker.system.fileName(),
            mimetype: faker.system.mimeType()
        },
        enabled
    }));

    return users;

};

module.exports = generateFakeUsers;
