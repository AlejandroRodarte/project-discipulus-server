const { Schema } = require('mongoose');

const { functions } = require('../../../util');
const { db } = require('../../../shared');

const homeworkSectionDefinition = {

    homework: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework _id is required'],
        ref: db.names.homework.modelName
    },

    title: {
        type: String,
        required: [true, 'A homework section title is required'],
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use profane words on your homework section title'
        ],
        minlength: [3, 'Homework section title must be at least 3 characters long'],
        maxlength: [80, 'Homework section title must be shorter than 80 characters'],
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
        maxlength: [500, 'Homework section description must be shorter than 500 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    points: {
        type: Number,
        required: [true, 'Please provide how many points is this homework section worth'],
        min: [1, 'Homework section points should be greater or equal than 1'],
        max: [10000, 'Homework section points should be lower or equal than 10000']
    }

};

module.exports = homeworkSectionDefinition;
