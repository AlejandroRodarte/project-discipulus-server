const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const sessionStudentFileDefinition = {

    sessionStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session-student _id is required'],
        ref: db.names.sessionStudent.modelName
    },

    file: {
        type: schemas.sharedFileSchema,
        required: [true, 'A file is required']
    }

};

module.exports = sessionStudentFileDefinition;
