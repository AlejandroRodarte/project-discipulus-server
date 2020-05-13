const { Schema } = require('mongoose');

const { class: clazz, user } = require('../../names');

const classStudentInvitationDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: clazz.modelName
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A student _id is required'],
        ref: user.modelName
    }

};

module.exports = classStudentInvitationDefinition;
