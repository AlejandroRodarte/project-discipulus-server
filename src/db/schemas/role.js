const { Schema } = require('mongoose');

const regexp = require('../../util/regexp');

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: [regexp.roleName, 'Roles must start with the ROLE_ keyword'],
        unique: true,
        minlength: 6,
        maxlength: 30,
        trim: true,
        uppercase: true
    }
});

module.exports = roleSchema;
