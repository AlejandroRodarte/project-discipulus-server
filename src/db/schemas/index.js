const { roleDefinition, roleSchema } = require('./role');
const { userDefinition, userSchema } = require('./user');
const { fileDefinition, fileSchema } = require('./file');
const { userRoleDefinition, userRoleSchema } = require('./user-role');
const { parentStudentDefinition, parentStudentSchema } = require('./parent-student');

module.exports = {

    definitions: {
        roleDefinition,
        userDefinition,
        fileDefinition,
        userRoleDefinition,
        parentStudentDefinition
    },

    schemas: {
        roleSchema,
        userSchema,
        fileSchema,
        userRoleSchema,
        parentStudentSchema
    }

};
