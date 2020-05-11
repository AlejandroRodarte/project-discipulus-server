const { generateFakeClass } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { user, class: clazz } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedClasses = persisted[clazz.modelName];

const classes = [

    ...generateOneToMany('user', persistedUsers[2]._id, [

        // 0. associate user[2] to another class that has the exact same title as
        // the one it has persisted
        {
            ...generateFakeClass({
                titleWords: 6,
                descriptionWords: 18,
                sessions: [[0, 30], [40, 100]]
            }),
            title: persistedClasses[0].title
        },

        // 1. associate user[2] to a unique class
        generateFakeClass({
            titleWords: 7,
            descriptionWords: 21,
            sessions: [[0, 20], [40, 120]]
        })

    ])

];

module.exports = {
    [clazz.modelName]: classes
};
