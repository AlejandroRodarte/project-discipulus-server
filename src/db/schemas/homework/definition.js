const { Schema } = require('mongoose');

const { functions, models } = require('../../../util');
const { db } = require('../../../shared');

const { schemas } = require('../shared');

const homeworkDefinition = {

    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class _id is required'],
        ref: db.names.class.modelName
    },

    title: {
        type: String,
        required: [true, 'A homework title is required'],
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use profane words on your homework title'
        ],
        minlength: [3, 'Homework title must be at least 3 characters long'],
        maxlength: [80, 'Homework title must be shorter than 80 characters'],
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
            'Do not use profane words on your homework description'
        ],
        maxlength: [500, 'Class description must be shorter than 500 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    type: {
        type: String,
        enum: {
            values: [models.class.gradeType.SECTIONS, models.class.gradeType.NO_SECTIONS],
            message: 'Provide a valid homework type'
        }
    },

    grade: {
        type: Number,
        required: [true, 'Please provide a grade to this homework'],
        min: [1, 'Provide a grade higher or equal to 1'],
        max: [10000, 'Provide a grade lower or equal to 10000']
    },

    timeRange: {
        type: schemas.sharedOptionalEndTimeRangeSchema,
        default: {}
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = homeworkDefinition;
