const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const { roles } = require('../../shared');

const users = [

    // 0-2: generate 3 enabled fake users
    ...models.generateFakeUsers(3, { fakeToken: true }),

    // 3: disabled user
    ...models.generateFakeUsers(1, { fakeToken: true, enabled: false })

];

const usersRoles = [

    // 0. user[0] with admin role
    ...util.generateOneToMany('user', users[0]._id, [{ role: roles.ids.ROLE_ADMIN }]),

    // 1-2: user[1] with admin/parent roles
    ...util.generateOneToMany('user', users[1]._id, [{ role: roles.ids.ROLE_ADMIN }, { role: roles.ids.ROLE_PARENT }])

];

const persisted = {
    [db.names.role.modelName]: roles.roles,
    [db.names.user.modelName]: users,
    [db.names.userRole.modelName]: usersRoles
};

module.exports = persisted;