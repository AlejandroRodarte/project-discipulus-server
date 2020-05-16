const { sharedFileDefinition, sharedFileSchema } = require('./file');
const { sharedParentStudentDefinition, sharedParentStudentSchema } = require('./parent-student');
const { sharedUserFileDefinition, sharedUserFileSchema } = require('./user-file');
const { sharedTimeRangeDefinition, sharedTimeRangeSchema } = require('./time-range');
const { sharedNoteDefinition, sharedNoteSchema } = require('./note');

module.exports = {
    definitions: {
        sharedFileDefinition,
        sharedParentStudentDefinition,
        sharedUserFileDefinition,
        sharedTimeRangeDefinition,
        sharedNoteDefinition
    },
    schemas: {
        sharedFileSchema,
        sharedParentStudentSchema,
        sharedUserFileSchema,
        sharedTimeRangeSchema,
        sharedNoteSchema
    }
};
