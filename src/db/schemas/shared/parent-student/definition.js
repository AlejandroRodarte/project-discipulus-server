const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedParentStudentDefinition = {
    parent: {
        type: Schema.Types.ObjectId,
        required: [true, 'A parent _id is required'],
        ref: db.names.user.modelName
    },
    student: {
        type: Schema.Types.ObjectId,
        required: [true, 'A parent _id is required'],
        ref: db.names.user.modelName
    }
};

module.exports = sharedParentStudentDefinition;
