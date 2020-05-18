const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const classStudentDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: db.names.classStudent.modelName
    },

    session: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session _id is required'],
        ref: db.names.session.modelName
    },

    write: {
        type: Boolean,
        default: false
    }
    
};

module.exports = classStudentDefinition;
