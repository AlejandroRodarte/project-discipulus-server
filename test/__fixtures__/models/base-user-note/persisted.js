const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const users = [

    // 0: enabled user
    ...models.generateFakeUsers(1, { fakeToken: true }),

    // 1: disabled user
    ...models.generateFakeUsers(1, {
        fakeToken: true,
        enabled: false
    })

];

const userNotes = [
    // 0-1: user[0] with two notes
    ...util.generateOneToMany('user', users[0]._id, [{ note: models.generateFakeNote() }, { note: models.generateFakeNote() }]),
];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.userNote.modelName]: userNotes
};
