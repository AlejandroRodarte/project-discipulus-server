const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

// 0: generate 1 sample user
const users = models.generateFakeUsers(1, { fakeToken: true });

const classes = [

    // 0: user[0] with one associated class
    ...util.generateOneToMany('user', users[0]._id, [
        models.generateFakeClass({
            titleWords: 5,
            descriptionWords: 20,
            timeRanges: [[0, 20], [50, 80]]
        })
    ])

];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.class.modelName]: classes
};
