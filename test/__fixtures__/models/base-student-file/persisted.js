const { models, util } = require('../../functions');

const { roles } = require('../../shared');

const { db } = require('../../../../src/shared');

// 0: generate 1 enabled user
const users = models.generateFakeUsers(1, { fakeToken: true });

const usersRoles = [
    // 0. user[0] as student
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_STUDENT }]),
];

const studentsFiles = [
    // 0-1: user[0] (student) with two files
    ...util.generateOneToMany('user', users[0]._id, [{ file: models.generateFakeFile() }, { file: models.generateFakeFile() }]),
];

module.exports = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: usersRoles,
    [db.names.studentFile.modelName]: studentsFiles
};
