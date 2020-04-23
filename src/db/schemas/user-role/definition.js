const { Schema } = require('mongoose');

const userRoleDefinition = {

    role: {
        type: Schema.Types.ObjectId,
        required: [true, 'A role id is required'],
        ref: 'Role'
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user id is required'],
        ref: 'User'
    }

};

module.exports = userRoleDefinition;
