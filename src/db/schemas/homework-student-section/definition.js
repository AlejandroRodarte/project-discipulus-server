const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { functions } = require('../../../util');

const homeworkStudentSectionDefinition = {

    homeworkStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework-student _id is required'],
        ref: db.names.homeworkStudent.modelName
    },

    homeworkSection: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework-section _id is required'],
        ref: db.names.homeworkSection.modelName
    },

    points: {
        type: Number,
        default: 0,
        min: [0, 'Provide a grade less or equal than 0'],
        max: [10000, 'Provide a grade higher or equal than 10000']
    },

    comments: {
        type: String,
        required: false,
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use profane words on your homework student section comments'
        ],
        maxlength: [500, 'Homework student section comments must be shorter than 500 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    }

};

module.exports = homeworkStudentSectionDefinition;
