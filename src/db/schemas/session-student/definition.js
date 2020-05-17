const { Schema } = require('mongoose');

const { classStudent, session } = require('../../names');

const classStudentDefinition = {

    classStudent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A class-student _id is required'],
        ref: classStudent.modelName
    },

    session: {
        type: Schema.Types.ObjectId,
        required: [true, 'A session _id is required'],
        ref: session.modelName
    },

    write: {
        type: Boolean,
        default: false
    }
    
};

module.exports = classStudentDefinition;
