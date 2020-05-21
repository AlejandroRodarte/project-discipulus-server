const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const homeworkNoteDefinition = {

    homework: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework _id is required'],
        ref: db.names.homework.modelName
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

module.exports = homeworkNoteDefinition;
