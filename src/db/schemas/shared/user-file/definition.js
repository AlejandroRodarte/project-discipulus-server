const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const { sharedFileSchema } = require('../file');

const sharedUserFileDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user _id is required'],
        ref: db.names.user.modelName
    },

    file: {
        type: sharedFileSchema,
        required: [true, 'A file object is required']
    }

};

module.exports = sharedUserFileDefinition;
