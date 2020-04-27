const { user } = require('../../../../src/db/names');

const generateFakeUsers = require('../../functions/models/generate-fake-users');

const persisted = require('./persisted');

const [uniqueUser] = generateFakeUsers(1);

const [persistedUser] = persisted[user.modelName];

const unpersisted = {

    [user.modelName]: [

        // 0. completely unique user
        uniqueUser,

        // 1. unique user but exact name against persisted one
        {
            ...uniqueUser,
            name: persistedUser.name
        },

        // 2. unique user but exact username agains persisted one
        {
            ...uniqueUser,
            username: persistedUser.username
        },

        // 3. unique user but exact email against persisted one
        {
            ...uniqueUser,
            email: persistedUser.email
        }
    ]

};

module.exports = unpersisted;