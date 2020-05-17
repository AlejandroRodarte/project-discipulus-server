const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, studentNote, role, userRole } = require('../../../../src/db/names');

const { ids, roles } = require('../../../__fixtures__/shared/roles');

// 0: sample user
const users = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const userRoles = [
    // 0: user[0] as student
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_STUDENT }])
];

const studentNotes = [
    // 0-1: user[0] with two notes
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ note: modelFunctions.generateFakeNote() }, { note: modelFunctions.generateFakeNote() }]),
];

module.exports = {
    [role.modelName]: roles,
    [userRole.modelName]: userRoles,
    [user.modelName]: users,
    [studentNote.modelName]: studentNotes
};
