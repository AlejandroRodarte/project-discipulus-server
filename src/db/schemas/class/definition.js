const { Schema } = require('mongoose');

const { functions, regexp } = require('../../../util');
const { db } = require('../../../shared');

const { schemas } = require('../shared');

const classDefinition = {

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A teacher _id is required'],
        ref: db.names.user.modelName
    },

    title: {
        type: String,
        required: [true, 'An event title is required'],
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use profane words on your class title'
        ],
        minlength: [3, 'Class title must be at least 3 characters long'],
        maxlength: [80, 'Class title must be shorter than 80 characters'],
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
            'Do not use profane words on your class description'
        ],
        maxlength: [500, 'Class description must be shorter than 500 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    avatar: {
        type: schemas.sharedFileSchema,
        required: false,
        validate: [
            (file) => {

                if (!regexp.imageExtension.test(file.originalname)) {
                    return false;
                }
                if (!regexp.imageMimetype.test(file.mimetype)) {
                    return false;
                }

                return true;

            },
            'Please provide an avatar with a proper filetype (png, jpg, jpeg, gif, bmp)'
        ]
    },

    timeRanges: {
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
