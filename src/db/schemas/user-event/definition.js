const { Schema } = require('mongoose');

const { user } = require('../../../db/names');
const { sharedTimeRangeSchema } = require('../shared/time-range');

const utilFunctions = require('../../../util/functions');

const userEventDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user _id is required'],
        ref: user.modelName
    },

    title: {
        type: String,
        required: [true, 'An event title is required'],
        minlength: [3, 'Event title must be at least 3 characters long'],
        maxlength: [50, 'Event title must be shorter than 50 characters'],
        set: (value) => {
            if (value) {
                return utilFunctions.trimRedundantSpaces(value);
            }
        }
    },

    description: {
        type: String,
        required: false,
        maxlength: [200, 'Event description must be shorter than 200 characters'],
        set: (value) => {
            if (value) {
                return utilFunctions.trimRedundantSpaces(value);
            }
        }
    },

    timerange: {
        type: sharedTimeRangeSchema,
        required: [true, 'Please provide a time range']
    },

    before: {
        type: Number,
        required: [true, 'Provide a notification time before the event starts'],
        min: [60, 'Notifications should be programmed at least 1 minute before the event starts']
    }

};

module.exports = userEventDefinition;
