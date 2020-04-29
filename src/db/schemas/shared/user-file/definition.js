const { Schema } = require('mongoose');

const { user } = require('../../../names');

const { sharedFileSchema } = require('../../shared/file');

const sharedUserFileDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user _id is required'],
        ref: user.modelName
    },

    file: {
        type: sharedFileSchema,
        required: true
    }

};

module.exports = sharedUserFileDefinition;
