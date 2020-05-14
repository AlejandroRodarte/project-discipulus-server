const { Schema } = require('mongoose');

const { class: clazz } = require('../../names');

const { sharedFileSchema } = require('../shared/file');

const classFileDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: clazz.modelName
    },

    file: {
        type: sharedFileSchema,
        required: [true, 'A file is required']
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = classFileDefinition;
