const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, userNote } = require('../../../../src/db/names');

const users = [

    // 0: enabled user
    ...modelFunctions.generateFakeUsers(1, { fakeToken: true }),

    // 1: disabled user
    ...modelFunctions.generateFakeUsers(1, {
        fakeToken: true,
        enabled: false
    })

];

const userNotes = [
    // 0-1: user[0] with two notes
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ note: modelFunctions.generateFakeNote() }, { note: modelFunctions.generateFakeNote() }]),
];

module.exports = {
    [user.modelName]: users,
    [userNote.modelName]: userNotes
};
