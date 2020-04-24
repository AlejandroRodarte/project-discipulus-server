const validator = require('validator').default;

const { fileSchema } = require('../file');
const { fullName, singleName, username } = require('../../../util/regexp');
const { badWordsFilter } = require('../../../util/filter/bad-words-filter');
const utilFunctions = require('../../../util/functions');

const userDefinition = {

    name: {
        type: String,
        required: [true, 'A user name is required'],
        validate: [
            (value) => {

                if (!fullName.test(value) && !singleName.test(value)) {
                    return false;
                }

                if (value.split(' ').some(word => badWordsFilter.isProfane(word))) {
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
                return utilFunctions.trimRedundantSpaces(value);
            }
        }
    },

    username: {
        type: String,
        required: [true, 'A unique username is required'],
        validate: [
            (value) => {

                if (!username.test(value)){
                    return false;
                }

                if (badWordsFilter.isProfane(value)) {
                    return false;
                }

                return true;

            },
            'Please provide a valid username (no bad words!)'
        ],
        unique: true,
        minlength: [4, 'Your username must be at least 4 characters long'],
        maxlength: [20, 'Your username must not exceed 20 characters long'],
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
        minlength: [60, 'Your username must be at least 60 characters long'],
        maxlength: [60, 'Your username must not exceed 60 characters long'],
    },

    tokens: [{
        type: String
    }],

    avatar: {
        type: fileSchema,
        required: false
    },

    enabled: {
        type: Boolean,
        required: false,
        default: true
    }

};

module.exports = userDefinition;
