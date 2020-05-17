const { Schema } = require('mongoose');

const { session } = require('../../names');

const { sharedNoteSchema } = require('../shared/note');

const sessionNoteDefinition = {

    session: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session _id is required'],
        ref: session.modelName
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

module.exports = sessionNoteDefinition;
