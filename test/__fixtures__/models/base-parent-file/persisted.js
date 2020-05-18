const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const { roles } = require('../../shared');

// 0: generate 1 enabled user
const users = models.generateFakeUsers(1, { fakeToken: true });

const usersRoles = [
    // 0. user[0] as parent
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_PARENT }]),
];

const parentsFiles = [
    // 0-1: user[0] (parent) with two files
    ...util.generateOneToMany('user', users[0]._id, [{ file: models.generateFakeFile() }, { file: models.generateFakeFile() }]),
];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: usersRoles,
    [db.names.parentFile.modelName]: parentsFiles
};
