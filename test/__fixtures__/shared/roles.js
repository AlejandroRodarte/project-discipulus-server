const { Types } = require('mongoose');

const roleTypes = require('../../../src/util/roles');

const roles = [
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_PARENT
    },
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_STUDENT
    },
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_TEACHER
    },
    {
        _id: new Types.ObjectId(),
        name: roleTypes.ROLE_ADMIN
    }
];

const [ROLE_PARENT, ROLE_STUDENT, ROLE_TEACHER, ROLE_ADMIN] = roles.map(role => role._id);

module.exports = {
    roles,
    ids: {
        ROLE_PARENT,
        ROLE_STUDENT,
        ROLE_TEACHER,
        ROLE_ADMIN
    }
};
