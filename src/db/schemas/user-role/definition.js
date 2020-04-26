const { Schema } = require('mongoose');

const { role, user } = require('../../names');

const userRoleDefinition = {

    role: {
        type: Schema.Types.ObjectId,
        required: [true, 'A role id is required'],
        ref: role.modelName
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user id is required'],
        ref: user.modelName
    }

};

module.exports = userRoleDefinition;
