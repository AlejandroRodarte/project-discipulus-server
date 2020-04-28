const { roleDefinition, roleSchema } = require('./role');
const { userDefinition, userSchema } = require('./user');
const { userRoleDefinition, userRoleSchema } = require('./user-role');
const { parentStudentDefinition, parentStudentSchema } = require('./parent-student');
const shared = require('./shared');

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
    },

    shared

};
