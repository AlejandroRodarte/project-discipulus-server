const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { functions } = require('../../../util');

const sessionDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    title: {
        type: String,
        required: [true, 'A session title is required'],
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use bad words on your session title'
        ],
        minlength: [3, 'Provide a session title longer than 3 characters'],
        maxlength: [50, 'Provide a session title shorter than 50 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    description: {
        type: String,
        required: false,
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use bad words on your session description'
        ],
        maxlength: [1000, 'Provide a session description shorter than 1000 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    live: {
        type: Boolean,
        default: true
    }

};

module.exports = sessionDefinition;
