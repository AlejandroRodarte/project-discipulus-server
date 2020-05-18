const { regexp, filter } = require('../../../../util');

const sharedFileDefinition = {

    originalname: {
        type: String,
        required: [true, 'An original filename is required'],
        validate: [
            (value) => {

                if (!regexp.filename.test(value)) {
                    return false;
                }

                const [name] = value.split('.');

                if (filter.badWordsFilter.filter.isProfane(name)) {
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
        validate: [regexp.mimeType, 'Please provide a valid mimetype'],
        unique: false,
        trim: true
    }

};

module.exports = sharedFileDefinition;
