const { Schema } = require('mongoose');
const validator = require('validator').default;

const { db } = require('../../../shared');

const classStudentInvitationDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    email: {
        type: String,
        required: [true, 'An email is required'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        trim: true
    }

};

module.exports = classStudentInvitationDefinition;
