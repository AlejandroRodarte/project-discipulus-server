const { sharedFileDefinition, sharedFileSchema } = require('./file');
const { sharedParentStudentDefinition, sharedParentStudentSchema } = require('./parent-student');
const { sharedUserFileDefinition, sharedUserFileSchema } = require('./user-file');
const { sharedTimeRangeDefinition, sharedTimeRangeSchema } = require('./time-range');

module.exports = {
    definitions: {
        sharedFileDefinition,
        sharedParentStudentDefinition,
        sharedUserFileDefinition,
        sharedTimeRangeDefinition
    },
    schemas: {
        sharedFileSchema,
        sharedParentStudentSchema,
        sharedUserFileSchema,
        sharedTimeRangeSchema
    }
};
