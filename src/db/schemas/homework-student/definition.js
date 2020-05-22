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
        default: 0,
        min: [0, 'Minimum grade should be higher or equal to 0'],
        max: [10000, 'Maximum grade should be lower or equal to 10000']
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

    forced: {
        type: Boolean,
        default: false
    },

    published: {
        type: Boolean,
        default: false
    }

};

module.exports = homeworkStudentDefinition;
