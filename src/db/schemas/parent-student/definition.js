const { Schema } = require('mongoose');

const parentStudentDefinition = {
    parent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A parent _id is required'],
        ref: 'User'
    },
    student: {
        type: Schema.Types.ObjectId,
        required: [true, 'A parent _id is required'],
        ref: 'User'
    }
};

module.exports = parentStudentDefinition;
