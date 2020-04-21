const { roleDefinition, roleSchema } = require('./role');
const { userDefinition, userSchema } = require('./user');
const { fileDefinition, fileSchema } = require('./file');

module.exports = {

    definitions: {
        roleDefinition,
        userDefinition,
        fileDefinition
    },

    schemas: {
        roleSchema,
        userSchema,
        fileSchema
    }

};
