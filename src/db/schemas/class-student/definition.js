const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const classStudentDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A student _id is required'],
        ref: db.names.user.modelName
    },

    write: {
        type: Boolean,
        default: false
    },

    archive: {
        type: Boolean,
        default: false
    }

};

module.exports = classStudentDefinition;
