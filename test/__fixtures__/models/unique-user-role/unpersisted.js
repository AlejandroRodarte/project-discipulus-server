const { Types } = require('mongoose');

const { userRole } = require('../../../../src/db/names');

const persisted = require('./persisted');

const [persistedUserRole] = persisted[userRole.modelName];

const unpersisted = {

    [userRole.modelName]: [

        // 0. same user id as persisted user-role but different role
        {
            user: persistedUserRole.user,
            role: new Types.ObjectId()
        },

        // 1. same role id as persisted user-role but different user
        {
            user: new Types.ObjectId(),
            role: persistedUserRole.role
        },

        // 2. different user id and role id
        {
            user: new Types.ObjectId(),
            role: new Types.ObjectId()
        },

        // 3. same user/role id combo
        {
            user: persistedUserRole.user,
            role: persistedUserRole.role
        }

    ]

};

module.exports = unpersisted;