const validator = require('validator').default;

const { regexp, filter, functions } = require('../../../util');

const { schemas } = require('../shared');

const userDefinition = {

    name: {
        type: String,
        required: [true, 'A user name is required'],
        validate: [
            (value) => {

                if (!regexp.fullName.test(value) && !singleName.test(value)) {
                    return false;
                }

                if (value.split(' ').some(word => filter.badWordsFilter.filter.isProfane(word))) {
                    return false;
                }

                return true;

            },
            'Please provide a valid name (no bad words!)'
        ],
        unique: false,
        minlength: [3, 'Your name must be at least 3 characters long'],
        maxlength: [100, 'Your name must not exceed 100 characters long'],
        set: (value) => {
            if (value) {
                return functions.trimRedundantSpaces(value);
            }
        }
    },

    username: {
        type: String,
        required: [true, 'A unique username is required'],
        validate: [
            (value) => {

                if (!regexp.username.test(value)){
                    return false;
                }

                if (filter.badWordsFilter.filter.isProfane(value)) {
                    return false;
                }

                return true;

            },
            'Please provide a valid username (no bad words!)'
        ],
        unique: true,
        minlength: [3, 'Your username must be at least 3 characters long'],
        maxlength: [30, 'Your username must not exceed 30 characters long'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'A unique email is required'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'A password is required'],
        validate: [regexp.strongPassword, 'Please provide a strong enough password'],
        minlength: [8, 'Your username must be at least 8 characters long']
    },

    tokens: [{
        type: String
    }],

    avatar: {
        type: schemas.sharedFileSchema,
        required: false,
        validate: [
            (file) => {

                if (!regexp.imageExtension.test(file.originalname)) {
                    return false;
                }
                if (!regexp.imageMimetype.test(file.mimetype)) {
                    return false;
                }

                return true;

            },
            'Please provide an avatar with a proper filetype (png, jpg, jpeg, gif, bmp)'
        ]
    },

    enabled: {
        type: Boolean,
        required: false,
        default: true
    }

};

module.exports = userDefinition;
