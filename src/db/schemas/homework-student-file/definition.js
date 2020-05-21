const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const homeworkStudentFileDefinition = {

    homeworkStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A homework-student _id is required'],
        ref: db.names.homeworkStudent.modelName
    },

    file: {
        type: schemas.sharedFileSchema,
        required: [true, 'A file is required']
    }

};

module.exports = homeworkStudentFileDefinition;
