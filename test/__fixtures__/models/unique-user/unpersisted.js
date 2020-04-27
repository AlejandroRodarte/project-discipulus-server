const { user } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const persisted = require('./persisted');

const [uniqueUser] = generateFakeUsers(1);

const [persistedUser] = persisted[user.modelName];

const unpersisted = {

    [user.modelName]: [
        uniqueUser,
        {
            ...uniqueUser,
            name: persistedUser.name
        },
        {
            ...uniqueUser,
            username: persistedUser.username
        },
        {
            ...uniqueUser,
            email: persistedUser.email
        }
    ]

};

module.exports = unpersisted;