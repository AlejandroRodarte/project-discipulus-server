const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

// 0: generate 1 enabled user
const users = models.generateFakeUsers(1, { fakeToken: true });

const userEvents = [
    // 0-1: user[0] with two events
    ...util.generateOneToMany('user', users[0]._id, [
        models.generateFakeEvent({ titleWords: 2, descriptionWords: 5, start: 10, end: 1000, before: 70 }),
        models.generateFakeEvent({ titleWords: 3, descriptionWords: 8, start: 1500, end: 30000, before: 120 })
    ]),
];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.userEvent.modelName]: userEvents
};