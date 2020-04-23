const { Schema } = require('mongoose');

const userRoleDefinition = {

    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

};

module.exports = userRoleDefinition;
