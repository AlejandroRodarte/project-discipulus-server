const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

// 0: generate one sample user
const users = models.generateFakeUsers(1, { fakeToken: true });

const parentNotes = [
    // 0: user[0] as parent with sample note
    ...util.generateOneToMany('user', users[0]._id, [{ note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.user.modelName]: users,
    [db.names.parentNote.modelName]: parentNotes
};
