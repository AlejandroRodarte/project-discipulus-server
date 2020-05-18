const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const { schemas } = require('../shared');

const classStudentFileDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: db.names.classStudent.modelName
    },

    file: {
        type: schemas.sharedFileSchema,
        required: [true, 'A file is required']
    }

};

module.exports = classStudentFileDefinition;
