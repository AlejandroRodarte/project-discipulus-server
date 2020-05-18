const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const classStudentInvitationDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A student _id is required'],
        ref: db.names.user.modelName
    }

};

module.exports = classStudentInvitationDefinition;
