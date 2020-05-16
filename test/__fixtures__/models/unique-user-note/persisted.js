const { user, userNote } = require('../../../../src/db/names');

const modelFunctions = require('../../../__fixtures__/functions/models');
const utilFunctions = require('../../../__fixtures__/functions/util');

// 0: generate one sample user
const users = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const userNotes = [
    // 0: user[0] with sample note
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ note: modelFunctions.generateFakeNote() }])
];

module.exports = {
    [user.modelName]: users,
    [userNote.modelName]: userNotes
};
