const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const classFileDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    file: {
        type: schemas.sharedFileSchema,
        required: [true, 'A file is required']
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = classFileDefinition;
