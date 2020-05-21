const { sharedFileDefinition, sharedFileSchema } = require('./file');
const { sharedParentStudentDefinition, sharedParentStudentSchema } = require('./parent-student');
const { sharedUserFileDefinition, sharedUserFileSchema } = require('./user-file');
const { sharedTimeRangeDefinition, sharedTimeRangeSchema } = require('./time-range');
const { sharedNoteDefinition, sharedNoteSchema } = require('./note');
const { sharedUserNoteDefinition, sharedUserNoteSchema } = require('./user-note');
const { sharedClassGradeDefinition, sharedClassGradeSchema } = require('./class-grade');
const { sharedOptionalEndTimeRangeDefinition, sharedOptionalEndTimeRangeSchema } = require('./optional-end-time-range');

module.exports = {
    definitions: {
        sharedFileDefinition,
        sharedParentStudentDefinition,
        sharedUserFileDefinition,
        sharedTimeRangeDefinition,
        sharedNoteDefinition,
        sharedUserNoteDefinition,
        sharedClassGradeDefinition,
        sharedOptionalEndTimeRangeDefinition
    },
    schemas: {
        sharedFileSchema,
        sharedParentStudentSchema,
        sharedUserFileSchema,
        sharedTimeRangeSchema,
        sharedNoteSchema,
        sharedUserNoteSchema,
        sharedClassGradeSchema,
        sharedOptionalEndTimeRangeSchema
    }
};
