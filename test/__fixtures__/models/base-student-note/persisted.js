const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, studentNote, role, userRole } = require('../../../../src/db/names');

const { ids, roles } = require('../../../__fixtures__/shared/roles');

const users = [

    // 0: enabled user
    ...modelFunctions.generateFakeUsers(1, { fakeToken: true }),

    // 1: disabled user
    ...modelFunctions.generateFakeUsers(1, { 
        fakeToken: true,
        enabled: false
    }),

    // 2. enabled user
    ...modelFunctions.generateFakeUsers(1, { fakeToken: true })

];

const userRoles = [

    // 0: user[0] (enabled) as student
    ...utilFunctions.generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_STUDENT }]),

    // 1: user[1] (disabled) as student
    ...utilFunctions.generateOneToMany('user', users[1]._id, [{ role: ids.ROLE_STUDENT }]),

    // 2: user[2] (enabled) as teacher
    ...utilFunctions.generateOneToMany('user', users[2]._id, [{ role: ids.ROLE_TEACHER }])

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
