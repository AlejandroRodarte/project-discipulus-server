const { Schema } = require('mongoose');

const { class: clazz } = require('../../names');

const { sharedNoteSchema } = require('../shared/note');

const classNoteDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: clazz.modelName
    },

    note: {
        type: sharedNoteSchema,
        required: [true, 'A note is required']
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = classNoteDefinition;
