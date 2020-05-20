const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { util } = require('../../functions');

const { roles } = require('../../shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];

const userRoles = [

    // 0. unknown user with parent role
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ role: roles.ids.ROLE_PARENT }]),

    // 1. user[3] (disabled) with parent role
    ...util.generateOneToMany('user', persistedUsers[3]._id, [{ role: roles.ids.ROLE_PARENT }]),

    // user[0] (enabled) with...
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 2. unknown role
        { role: new Types.ObjectId() },

        // 3. admin role (already has it)
        { role: roles.ids.ROLE_ADMIN },

        // 4. teacher role (unique, valid)
        { role: roles.ids.ROLE_TEACHER }

    ])

];

module.exports = {
    [db.names.userRole.modelName]: userRoles
};
