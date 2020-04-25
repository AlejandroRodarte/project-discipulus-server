const { Types } = require('mongoose');

const { users } = require('../../user/persisted');
const { roles } = require('../../role/persisted');

const userRoles = [
    {
        _id: new Types.ObjectId(),
        user: users[0]._id,
        role: roles[0]._id
    }
];

module.exports = userRoles;
