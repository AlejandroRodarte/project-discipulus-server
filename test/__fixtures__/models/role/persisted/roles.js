const { Types } = require('mongoose');

const roles = [

    // admin role
    {
        _id: new Types.ObjectId(),
        name: 'ROLE_ADMIN'
    },

    // teacher role
    {
        _id: new Types.ObjectId(),
        name: 'ROLE_TEACHER'
    },

    // student role
    {
        _id: new Types.ObjectId(),
        name: 'ROLE_STUDENT'
    },

    // parent role
    {
        _id: new Types.ObjectId(),
        name: 'ROLE_PARENT'
    }
    
];

module.exports = roles;
