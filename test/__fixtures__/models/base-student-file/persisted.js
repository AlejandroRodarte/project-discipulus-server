const { generateFakeFile, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { roles, ids } = require('../../shared/roles');

const { user, studentFile, role, userRole } = require('../../../../src/db/names');

// 0: generate 1 enabled user
const users = generateFakeUsers(1, { fakeToken: true });

const usersRoles = [
    // 0. user[0] as student
    ...generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_STUDENT }]),
];

const studentsFiles = [
    // 0-1: user[0] (student) with two files
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }, { file: generateFakeFile() }]),
];

module.exports = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles,
    [studentFile.modelName]: studentsFiles
};
