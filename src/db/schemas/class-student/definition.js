const { Schema } = require('mongoose');

const { class: clazz, user } = require('../../names');

const classStudentDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: clazz.modelName
    },

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A student _id is required'],
        ref: user.modelName
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
