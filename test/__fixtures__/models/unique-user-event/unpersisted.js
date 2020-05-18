const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedUserEvents = persisted[db.names.userEvent.modelName];

const userEvents = [
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] with event that has same title as userEvent[0]
        {
            ...models.generateFakeEvent(),
            title: persistedUserEvents[0].title
        },

        // 1. user[0] with unique event
        models.generateFakeEvent()

    ])
];

module.exports = {
    [db.names.userEvent.modelName]: userEvents
};
