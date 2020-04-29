const { roleDefinition, roleSchema } = require('./role');
const { userDefinition, userSchema } = require('./user');
const { userRoleDefinition, userRoleSchema } = require('./user-role');
const { parentStudentDefinition, parentStudentSchema } = require('./parent-student');
const { userFileDefinition, userFileSchema } = require('./user-file');
const { parentFileDefinition, parentFileSchema } = require('./parent-file');
const { studentFileDefinition, studentFileSchema } = require('./student-file');
const { teacherFileDefinition, teacherFileSchema } = require('./teacher-file');
const shared = require('./shared');

module.exports = {

    definitions: {
        roleDefinition,
        userDefinition,
        fileDefinition,
        userRoleDefinition,
        parentStudentDefinition,
        userFileDefinition,
        parentFileDefinition,
        studentFileDefinition,
        teacherFileDefinition
    },

    schemas: {
        roleSchema,
        userSchema,
        fileSchema,
        userRoleSchema,
        parentStudentSchema,
        userFileSchema,
        parentFileSchema,
        studentFileSchema,
        teacherFileSchema
    },

    shared

};
