const { generateFakeEvent, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { user, userEvent } = require('../../../../src/db/names');

// 0: generate 1 enabled user
const users = generateFakeUsers(1, { fakeToken: true });

const userEvents = [
    // 0-1: user[0] with two events
    ...generateOneToMany('user', users[0]._id, [
        generateFakeEvent({ titleWords: 2, descriptionWords: 5, start: 10, end: 1000, before: 70 }),
        generateFakeEvent({ titleWords: 3, descriptionWords: 8, start: 1500, end: 30000, before: 120 })
    ]),
];

module.exports = {
    [user.modelName]: users,
    [userEvent.modelName]: userEvents
};