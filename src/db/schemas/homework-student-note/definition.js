const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const homeworkStudentNoteDefinition = {

    homeworkStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework-student _id is required'],
        ref: db.names.homeworkStudent.modelName
    },

    note: {
        type: schemas.sharedNoteSchema,
        required: [true, 'A note is required']
    }

};

module.exports = homeworkStudentNoteDefinition;
