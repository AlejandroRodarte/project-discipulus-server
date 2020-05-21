const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const homeworkFileDefinition = {

    homework: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework _id is required'],
        ref: db.names.homework.modelName
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

module.exports = homeworkFileDefinition;
