const { Schema } = require('mongoose');

const { session } = require('../../names');

const { sharedFileSchema } = require('../shared/file');

const sessionFileDefinition = {

    session: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session _id is required'],
        ref: session.modelName
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

module.exports = sessionFileDefinition;
