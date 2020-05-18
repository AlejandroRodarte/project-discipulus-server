const { db } = require('../../../../src/shared');

const { models } = require('../../functions');

const persisted = require('./persisted');

const [uniqueUser] = models.generateFakeUsers(1);

const [persistedUser] = persisted[db.names.user.modelName];

const unpersisted = {

    [db.names.user.modelName]: [

        // 0. completely unique enabled user
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