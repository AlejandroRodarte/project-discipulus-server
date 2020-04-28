const { Schema } = require('mongoose');

const { user } = require('../../names');

const parentStudentInvitationDefinition = {
    parent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A parent _id is required'],
        ref: user.modelName
    },
    student: {
        type: Schema.Types.ObjectId,
        required: [true, 'A parent _id is required'],
        ref: user.modelName
    }
};

module.exports = parentStudentInvitationDefinition;
