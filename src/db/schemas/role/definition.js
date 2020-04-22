const regexp = require('../../../util/regexp');

const roleDefinition = {
    name: {
        type: String,
        required: [true, 'A role name is required'],
        validate: [regexp.roleName, 'Roles must start with the ROLE_ keyword'],
        unique: true,
        minlength: [7, 'Role name must be at least 6 characters long'],
        maxlength: [30, 'Role name must be at least 30 characters long'],
        trim: true,
        uppercase: true
    }
};

module.exports = roleDefinition;
