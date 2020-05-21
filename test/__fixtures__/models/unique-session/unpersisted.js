const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClasses = persisted[db.names.class.modelName];
const persistedSessions = persisted[db.names.session.modelName];

const sessions = [

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 0. class[0] with session that has same title as session[0] (owned by class[0])
        {
            ...models.generateFakeSession(),
            title: persistedSessions[0].title
        },

        // 1. class[0] with unique session
        models.generateFakeSession()

    ])
    
];

module.exports = {
    [db.names.session.modelName]: sessions
};
