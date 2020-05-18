const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedClasses = persisted[db.names.class.modelName];

const classes = [

    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0: different class associated to user[0] but exact same title
        {
            ...models.generateFakeClass({
                titleWords: 7,
                descriptionWords: 12,
                sessions: [[100, 200]]
            }),
            title: persistedClasses[0].title
        },

        // 1: completely unique class for user[0]
        models.generateFakeClass({
            titleWords: 5,
            descriptionWords: 10,
            sessions: [[50, 80]]
        })

    ])

]

module.exports = {
    [db.names.class.modelName]: classes
};
