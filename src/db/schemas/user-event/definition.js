const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { functions } = require('../../../util');

const { schemas } = require('../shared');

const userEventDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user _id is required'],
        ref: db.names.user.modelName
    },

    title: {
        type: String,
        required: [true, 'An event title is required'],
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Please do not use bad words on your event title'
        ],
        minlength: [3, 'Event title must be at least 3 characters long'],
        maxlength: [50, 'Event title must be shorter than 50 characters'],
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
            'Please do not use bad words on your event description'
        ],
        maxlength: [200, 'Event description must be shorter than 200 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    timerange: {
        type: schemas.sharedTimeRangeSchema,
        required: [true, 'Please provide a time range']
    },

    before: {
        type: Number,
        required: [true, 'Provide a notification time before the event starts'],
        min: [60, 'Notifications should be programmed at least 1 minute before the event starts']
    }

};

module.exports = userEventDefinition;
