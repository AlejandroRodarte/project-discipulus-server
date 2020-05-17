const { Schema } = require('mongoose');

const { class: clazz } = require('../../names');

const utilFunctions = require('../../../util/functions');

const sessionDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: clazz.modelName
    },

    title: {
        type: String,
        required: [true, 'A session title is required'],
        validate: [
            (value) => !utilFunctions.isSentenceProfane(value),
            'Do not use bad words on your session title'
        ],
        minlength: [3, 'Provide a session title longer than 3 characters'],
        maxlength: [50, 'Provide a session title shorter than 50 characters'],
        set: (value) => {
            if (value) {
                return utilFunctions.trimRedundantSpaces(value);
            }
        }
    },

    description: {
        type: String,
        required: false,
        validate: [
            (value) => !utilFunctions.isSentenceProfane(value),
            'Do not use bad words on your session description'
        ],
        maxlength: [1000, 'Provide a session description shorter than 1000 characters'],
        set: (value) => {
            if (value) {
                return utilFunctions.trimRedundantSpaces(value);
            }
        }
    },

    live: {
        type: Boolean,
        default: true
    }

};

module.exports = sessionDefinition;
