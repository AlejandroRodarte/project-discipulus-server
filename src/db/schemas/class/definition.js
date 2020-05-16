const { Schema } = require('mongoose');

const { user } = require('../../../db/names');
const { schemas } = require('../shared');

const utilFunctions = require('../../../util/functions');

const { imageMimetype, imageExtension } = require('../../../util/regexp');

const classDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A teacher _id is required'],
        ref: user.modelName
    },

    title: {
        type: String,
        required: [true, 'An event title is required'],
        validate: [
            (value) => !utilFunctions.isSentenceProfane(value),
            'Do not use profane words on your class title'
        ],
        minlength: [3, 'Event title must be at least 3 characters long'],
        maxlength: [80, 'Event title must be shorter than 80 characters'],
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
            'Do not use profane words on your class description'
        ],
        maxlength: [500, 'Event description must be shorter than 500 characters'],
        set: (value) => {
            if (value) {
                return utilFunctions.trimRedundantSpaces(value);
            }
        }
    },

    avatar: {
        type: schemas.sharedFileSchema,
        required: false,
        validate: [
            (file) => {

                if (!imageExtension.test(file.originalname)) {
                    return false;
                }
                if (!imageMimetype.test(file.mimetype)) {
                    return false;
                }

                return true;

            },
            'Please provide an avatar with a proper filetype (png, jpg, jpeg, gif, bmp)'
        ]
    },

    sessions: {
        type: [schemas.sharedTimeRangeSchema],
        validate: [
            (timeranges) => {

                if (!timeranges.length) {
                    return false;
                }

                const isIncremental = timeranges.every((timerange, index, self) => {

                    if (index === 0) {
                        return true;
                    }

                    return timerange.start >= self[index - 1].end;

                });

                return isIncremental;

            },
            'Please provide at gradually incrementing timeranges'
        ]
    },

    archive: {
        type: Boolean,
        default: false
    }

};

module.exports = classDefinition;
