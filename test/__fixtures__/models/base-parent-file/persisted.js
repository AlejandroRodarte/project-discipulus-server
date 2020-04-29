const { generateFakeFile, generateFakeUsers } = require('../../functions/models');
const generateOneToMany = require('../../functions/util/generate-one-to-many');

const { roles, ids } = require('../../shared/roles');

const { user, parentFile, role, userRole } = require('../../../../src/db/names');

// 0: generate 1 enabled user
const users = generateFakeUsers(1, { fakeToken: true });

const usersRoles = [
    // 0. user[0] as parent
    ...generateOneToMany('user', users[0]._id, [{ role: ids.ROLE_PARENT }]),
];

const parentsFiles = [
    // 0-1: user[0] (parent) with two files
    ...generateOneToMany('user', users[0]._id, [{ file: generateFakeFile() }, { file: generateFakeFile() }]),
];

module.exports = {
    [role.modelName]: roles,
    [user.modelName]: users,
    [userRole.modelName]: usersRoles,
    [parentFile.modelName]: parentsFiles
};
