const { Types } = require('mongoose');

const { sampleUserRole } = require('../../user-role/persisted');

const uniqueUserRoles = {

    sameUser: {
        user: sampleUserRole.user,
        role: new Types.ObjectId()
    },

    sameRole: {
        user: new Types.ObjectId(),
        role: sampleUserRole.role
    },

    unique: {
        user: new Types.ObjectId(),
        role: new Types.ObjectId()
    }

};

module.exports = uniqueUserRoles;
