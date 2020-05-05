const { generateFakeClass, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { user, class: clazz } = require('../../../../src/db/names');

// 0: generate 1 sample user
const users = generateFakeUsers(1, { fakeToken: true });

const classes = [

    // 0: user[0] with one associated class
    ...generateOneToMany('user', users[0]._id, [
        generateFakeClass({
            titleWords: 5,
            descriptionWords: 20,
            sessions: [[0, 20], [50, 80]]
        })
    ])

];

module.exports = {
    [user.modelName]: users,
    [clazz.modelName]: classes
};
