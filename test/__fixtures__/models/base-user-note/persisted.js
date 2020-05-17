const modelFunctions = require('../../functions/models');
const generateOneToMany = require('../../functions/util');

const { user, userNote } = require('../../../../src/db/names');

// 0: sample user
const users = generateFakeUsers(1, { fakeToken: true });

const userNotes = [
    // 0-1: user[0] with two notes
    ...generateOneToMany('user', users[0]._id, [{ note: modelFunctions.generateFakeNote() }, { note: modelFunctions.generateFakeNote() }]),
];

module.exports = {
    [user.modelName]: users,
    [userNote.modelName]: userNotes
};
