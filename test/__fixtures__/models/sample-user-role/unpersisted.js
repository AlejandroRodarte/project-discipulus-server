const { Types } = require('mongoose');

const { userRole } = require('../../../../src/db/names');

const persisted = require('./persisted');

const [persistedUserRole] = persisted[userRole.modelName];

const unpersisted = {

    [userRole.modelName]: [
        {
            user: persistedUserRole.user,
            role: new Types.ObjectId()
        },
        {
            user: new Types.ObjectId(),
            role: persistedUserRole.role
        },
        {
            user: new Types.ObjectId(),
            role: new Types.ObjectId()
        },
        {
            user: persistedUserRole.user,
            role: persistedUserRole.role
        }
    ]

};

module.exports = unpersisted;