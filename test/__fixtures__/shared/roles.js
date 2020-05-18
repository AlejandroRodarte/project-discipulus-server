const { Types } = require('mongoose');

const { roles } = require('../../../src/util');

const roleDocs = [
    {
        _id: new Types.ObjectId(),
        name: roles.ROLE_PARENT
    },
    {
        _id: new Types.ObjectId(),
        name: roles.ROLE_STUDENT
    },
    {
        _id: new Types.ObjectId(),
        name: roles.ROLE_TEACHER
    },
    {
        _id: new Types.ObjectId(),
        name: roles.ROLE_ADMIN
    }
];

const [ROLE_PARENT, ROLE_STUDENT, ROLE_TEACHER, ROLE_ADMIN] = roleDocs.map(role => role._id);

module.exports = {
    roles: roleDocs,
    ids: {
        ROLE_PARENT,
        ROLE_STUDENT,
        ROLE_TEACHER,
        ROLE_ADMIN
    }
};
