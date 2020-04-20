const { Schema } = require('mongoose');

const roleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please assign a unique role name.'],
        validate: [/^ROLE_/, 'Roles must start with the ROLE_ keyword'],
        unique: true,
        minlength: 6,
        maxlength: 30,
        trim: true,
        uppercase: true
    }
});

module.exports = roleSchema;
