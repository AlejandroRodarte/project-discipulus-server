const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const classStudentNoteDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: db.names.classStudent.modelName
    },

    note: {
        type: schemas.sharedNoteSchema,
        required: [true, 'A note is required']
    }

};

module.exports = classStudentNoteDefinition;
