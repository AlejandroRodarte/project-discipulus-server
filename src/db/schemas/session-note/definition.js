const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const sessionNoteDefinition = {

    session: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session _id is required'],
        ref: db.names.session.modelName
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

module.exports = sessionNoteDefinition;
