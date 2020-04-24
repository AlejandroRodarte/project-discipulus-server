const jwt = require('jsonwebtoken');
const faker = require('faker');
const { Types } = require('mongoose');

const { strongPassword } = require('../../../../../src/util/regexp');

const userIds = [...new Array(1)].map(_ => new Types.ObjectId());

const users = userIds.map(_id => ({
    _id: new Types.ObjectId(),
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(12, false, strongPassword),
    tokens: [
        jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME })
    ],
    avatar: {
        originalname: faker.system.fileName(),
        mimetype: faker.system.mimeType()
    }
}));

module.exports = users;