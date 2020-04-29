const { generateFakeFile, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { roles, ids } = require('../../shared/roles');

const { user, teacherFile, role, userRole } = require('../../../../src/db/names');

// 0: generate 1 enabled user
const users = generateFakeUsers(1, { fakeToken: true });

const usersRoles = [
    // 0. user[0] as teacher
    ...generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_TEACHER }]),
];

const teachersFiles = [
    // 0-1: user[0] (teacher) with two files
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }, { file: generateFakeFile() }]),
];

module.exports = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles,
    [teacherFile.modelName]: teachersFiles
};
