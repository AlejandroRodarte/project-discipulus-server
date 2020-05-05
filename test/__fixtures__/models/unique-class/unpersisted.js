const { generateFakeClass } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { user, class: clazz } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedClasses = persisted[clazz.modelName];

const classes = [

    ...generateOneToMany('user', persistedUsers[0]._id, [

        // 0: different class associated to user[0] but exact same title
        {
            ...generateFakeClass({
                titleWords: 7,
                descriptionWords: 12,
                sessions: [[100, 200]]
            }),
            title: persistedClasses[0].title
        },

        // 1: completely unique class for user[0]
        generateFakeClass({
            titleWords: 5,
            descriptionWords: 10,
            sessions: [[50, 80]]
        })

    ])

]

module.exports = {
    [clazz.modelName]: classes
};
