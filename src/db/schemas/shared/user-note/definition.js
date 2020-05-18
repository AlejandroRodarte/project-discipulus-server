const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const { sharedNoteSchema } = require('../note');

const sharedUserNoteDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user _id is required'],
        ref: db.names.user.modelName
    },

    note: {
        type: sharedNoteSchema,
        required: [true, 'A note object is required']
    }

};

module.exports = sharedUserNoteDefinition;
