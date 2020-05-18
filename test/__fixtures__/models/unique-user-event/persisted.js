const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

// 0: sample user
const users = models.generateFakeUsers(1, { fakeToken: true });

const userEvents = [
    ...util.generateOneToMany('user', users[0]._id, [
        models.generateFakeEvent({ titleWords: 2, descriptionWords: 5, start: 10, end: 1000, before: 70 })
    ]),
];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.userEvent.modelName]: userEvents
};