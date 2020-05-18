const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const sessionFileDefinition = {

    session: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session _id is required'],
        ref: db.names.session.modelName
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

module.exports = sessionFileDefinition;
