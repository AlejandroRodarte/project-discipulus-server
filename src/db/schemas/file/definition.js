const { filename, mimeType } = require('../../../util/regexp');

const fileDefinition = {

    originalname: {
        type: String,
        required: true,
        validate: [filename, 'Please provide a valid filename'],
        unique: false,
        minlength: 3,
        maxlength: 200,
        trim: true
    },

    mimetype: {
        type: String,
        required: true,
        validate: [mimeType, 'Please provide a valid mimetype'],
        unique: false,
        trim: true
    },

    keyname: {
        type: String,
        required: true,
        validate: [filename, 'Please provide a valid filename'],
        unique: true
    }

};

module.exports = fileDefinition;
