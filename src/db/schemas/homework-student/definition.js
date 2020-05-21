const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { functions } = require('../../../util');

const homeworkStudentDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: db.names.classStudent.modelName
    },

    homework: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework _id is required'],
        ref: db.names.homework.modelName
    },

    studentComments: {
        type: String,
        required: false,
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use bad words on your homework student comments'
        ],
        maxlength: [1000, 'Provide a homework student comment shorter than 1000 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    completed: {
        type: Boolean,
        default: false
    },

    directGrade: {
        type: Number,
        default: 0
    },

    teacherComments: {
        type: String,
        required: false,
        validate: [
            (value) => !functions.isSentenceProfane(value),
            'Do not use bad words on your homework teacher comments'
        ],
        maxlength: [1000, 'Provide a homework teacher comment shorter than 1000 characters'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = homeworkStudentDefinition;
