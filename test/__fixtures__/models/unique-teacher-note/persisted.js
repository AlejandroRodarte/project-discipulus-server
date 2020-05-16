const { user, teacherNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

// 0: generate one sample user
const users = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const teacherNotes = [
    // 0: user[0] as teacher with sample note
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ note: modelFunctions.generateFakeNote() }])
];

module.exports = {
    [user.modelName]: users,
    [teacherNote.modelName]: teacherNotes
};
