const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedClasses = persisted[db.names.class.modelName];

const classes = [

    // 0. class associated to an unknown user
    ...util.generateOneToMany('user', new Types.ObjectId(), [
        models.generateFakeClass({
            titleWords: 6,
            descriptionWords: 18,
            sessions: [[0, 30], [40, 100]]
        })
    ]),

    // 1. class associated to user[0] (disabled teacher)
    ...util.generateOneToMany('user', persistedUsers[0]._id, [
        models.generateFakeClass({
            titleWords: 6,
            descriptionWords: 18,
            sessions: [[0, 30], [40, 100]]
        })
    ]),

    // 2. class associated to user[1] (enabled student)
    ...util.generateOneToMany('user', persistedUsers[1]._id, [
        models.generateFakeClass({
            titleWords: 6,
            descriptionWords: 18,
            sessions: [[0, 30], [40, 100]]
        })
    ]),

    ...util.generateOneToMany('user', persistedUsers[2]._id, [

        // 3. associate user[2] (enabled teacher) to another class that has the exact same title as
        // the one it has persisted
        {
            ...models.generateFakeClass({
                titleWords: 6,
                descriptionWords: 18,
                sessions: [[0, 30], [40, 100]]
            }),
            title: persistedClasses[0].title
        },

        // 4. associate user[2] (enabled teacher) to a unique class
        models.generateFakeClass({
            titleWords: 7,
            descriptionWords: 21,
            sessions: [[0, 20], [40, 120]]
        })

    ])

];

module.exports = {
    [db.names.class.modelName]: classes
};
