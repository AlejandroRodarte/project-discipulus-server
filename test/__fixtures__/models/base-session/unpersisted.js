const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClasses = persisted[db.names.class.modelName];
const persistedSessions = persisted[db.names.session.modelName];

const sessions = [

    // 0. session associated to unknown class
    ...util.generateOneToMany('class', new Types.ObjectId(), [ models.generateFakeSession() ]),

    // class[0] associated with
    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 1. session that has same title has session[0] (associated to class[0])
        {
            ...models.generateFakeSession(),
            title: persistedSessions[0].title
        },

        // 2. unique session; class[0] has not students
        models.generateFakeSession()

    ]),

    // 3. class[1] (with 4 students) with new session
    ...util.generateOneToMany('class', persistedClasses[1]._id, [ models.generateFakeSession() ])

];

module.exports = {
    [db.names.session.modelName]: sessions
};
