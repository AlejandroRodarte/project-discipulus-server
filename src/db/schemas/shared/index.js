const { sharedFileDefinition, sharedFileSchema } = require('./file');
const { sharedParentStudentDefinition, sharedParentStudentSchema } = require('./parent-student');

module.exports = {
    definitions: {
        sharedFileDefinition,
        sharedParentStudentDefinition
    },
    schemas: {
        sharedFileSchema,
        sharedParentStudentSchema
    }
};
