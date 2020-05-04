const jwt = require('jsonwebtoken');
const faker = require('faker');
const { Types } = require('mongoose');

const generateFakeImageFile = require('./generate-fake-image-file');

const generateFakeUsers = (amount, config = {}) => {

    const { 
        enabled = true, 
        fakeToken = false,
        noAvatar = false
    } = config;

    const userIds = [...new Array(amount)].map(_ => new Types.ObjectId());

    const users = userIds.map(_id => ({
        _id: new Types.ObjectId(),
        name: faker.name.findName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: '$s4tic!paSsw0rd',
        tokens: [
            fakeToken ? 'some-token' : jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET || 'mock-secret', { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME || '1m' })
        ],
        avatar: noAvatar ? undefined : generateFakeImageFile(),
        enabled
    }));

    return users;

};

module.exports = generateFakeUsers;
