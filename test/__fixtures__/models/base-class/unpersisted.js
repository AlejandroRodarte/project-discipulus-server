const { Types } = require('mongoose');

const { generateFakeClass } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { user, class: clazz } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedClasses = persisted[clazz.modelName];

const classes = [

    // 0. class associated to an unknown user
    ...generateOneToMany('user', new Types.ObjectId(), [
        generateFakeClass({
            titleWords: 6,
            descriptionWords: 18,
            sessions: [[0, 30], [40, 100]]
        })
    ]),

    // 1. class associated to user[0] (disabled teacher)
    ...generateOneToMany('user', persistedUsers[0]._id, [
        generateFakeClass({
            titleWords: 6,
            descriptionWords: 18,
            sessions: [[0, 30], [40, 100]]
        })
    ]),

    // 2. class associated to user[1] (enabled student)
    ...generateOneToMany('user', persistedUsers[1]._id, [
        generateFakeClass({
            titleWords: 6,
            descriptionWords: 18,
            sessions: [[0, 30], [40, 100]]
        })
    ]),

    ...generateOneToMany('user', persistedUsers[2]._id, [

        // 3. associate user[2] (enabled teacher) to another class that has the exact same title as
        // the one it has persisted
        {
            ...generateFakeClass({
                titleWords: 6,
                descriptionWords: 18,
                sessions: [[0, 30], [40, 100]]
            }),
            title: persistedClasses[0].title
        },

        // 4. associate user[2] (enabled teacher) to a unique class
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
