const { Schema } = require('mongoose');

const { classStudent } = require('../../names');

const { sharedNoteSchema } = require('../shared/note');

const classStudentNoteDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: classStudent.modelName
    },

    note: {
        type: sharedNoteSchema,
        required: [true, 'A note is required']
    }

};

module.exports = classStudentNoteDefinition;
