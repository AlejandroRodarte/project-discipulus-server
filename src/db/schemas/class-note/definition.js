const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const classNoteDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    note: {
        type: schemas.sharedNoteSchema,
        required: [true, 'A note is required']
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = classNoteDefinition;
