const { Schema } = require('mongoose');

const { classStudent } = require('../../names');

const { sharedFileSchema } = require('../shared/file');

const classStudentFileDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: classStudent.modelName
    },

    file: {
        type: sharedFileSchema,
        required: [true, 'A file is required']
    }

};

module.exports = classStudentFileDefinition;
