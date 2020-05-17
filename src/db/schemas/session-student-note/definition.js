const { Schema } = require('mongoose');

const { sessionStudent } = require('../../names');

const { sharedNoteSchema } = require('../shared/note');

const sessionStudentNoteDefinition = {

    sessionStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session-student _id is required'],
        ref: sessionStudent.modelName
    },

    note: {
        type: sharedNoteSchema,
        required: [true, 'A note is required']
    }

};

module.exports = sessionStudentNoteDefinition;
