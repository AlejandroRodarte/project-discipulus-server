const { filename, mimeType } = require('../../../../util/regexp');
const { badWordsFilter } = require('../../../../util/filter/bad-words-filter');

const sharedFileDefinition = {

    originalname: {
        type: String,
        required: [true, 'An original filename is required'],
        validate: [
            (value) => {

                if (!filename.test(value)) {
                    return false;
                }

                const [name] = value.split('.');

                if (badWordsFilter.isProfane(name)) {
                    return false;
                }

                return true;

            }, 
            'Please provide a valid original filename (no bad words!)'
        ],
        unique: false,
        minlength: [3, 'Original filename must be longer than 3 characters'],
        maxlength: [200, 'Original filename must be shorter than 200 characters'],
        trim: true
    },

    mimetype: {
        type: String,
        required: [true, 'A mimetype is required'],
        validate: [mimeType, 'Please provide a valid mimetype'],
        unique: false,
        trim: true
    }

};

module.exports = sharedFileDefinition;
