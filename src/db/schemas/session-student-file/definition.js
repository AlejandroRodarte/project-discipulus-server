const { Schema } = require('mongoose');

const { sessionStudent } = require('../../names');

const { sharedFileSchema } = require('../shared/file');

const sessionStudentFileDefinition = {

    sessionStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session-student _id is required'],
        ref: sessionStudent.modelName
    },

    file: {
        type: sharedFileSchema,
        required: [true, 'A file is required']
    }

};

module.exports = sessionStudentFileDefinition;
