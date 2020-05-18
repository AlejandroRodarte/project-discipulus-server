const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const sessionStudentNoteDefinition = {

    sessionStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session-student _id is required'],
        ref: db.names.sessionStudent.modelName
    },

    note: {
        type: schemas.sharedNoteSchema,
        required: [true, 'A note is required']
    }

};

module.exports = sessionStudentNoteDefinition;
