const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const userRoleDefinition = {

    role: {
        type: Schema.Types.ObjectId,
        required: [true, 'A role id is required'],
        ref: db.names.role.modelName
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user id is required'],
        ref: db.names.user.modelName
    }

};

module.exports = userRoleDefinition;
