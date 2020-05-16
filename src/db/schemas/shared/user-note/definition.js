const { Schema } = require('mongoose');

const { user } = require('../../../names');

const { sharedNoteDefinition } = require('../../shared/note');

const sharedUserNoteDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user _id is required'],
        ref: user.modelName
    },

    note: {
        type: sharedNoteDefinition,
        required: [true, 'A note object is required']
    }

};

module.exports = sharedUserNoteDefinition;
