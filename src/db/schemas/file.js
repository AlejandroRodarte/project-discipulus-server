const { Schema } = require('mongoose');

const regexp = require('../../util/regexp');

const fileSchema = new Schema({

    originalname: {
        type: String,
        required: true,
        validate: [regexp.filename, 'Please provide a valid filename'],
        unique: false,
        minlength: 3,
        maxlength: 200,
        trim: true
    },

    mimetype: {
        type: String,
        required: true,
        validate: [regexp.mimeType, 'Please provide a valid mimetype'],
        unique: false,
        trim: true
    },

    keyname: {
        type: String,
        required: true,
        validate: [regexp.filename, 'Please provide a valid filename'],
        unique: true
    }

});

module.exports = fileSchema;
