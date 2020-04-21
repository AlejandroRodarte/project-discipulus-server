const { isEmail } = require('validator').default;

const { fileSchema } = require('../file');

const { fullName, singleName } = require('../../../util/regexp');
const { isProfane } = require('../../../util/filter/bad-words-filter');

const userDefinition = {

    name: {
        type: String,
        required: true,
        validate: [
            (value) => {

                if (!fullName.test(value) || !singleName.test(value)){
                    return false;
                }

                if (isProfane(value)) {
                    return false;
                }

                return true;

            },
            'Please provide a valid name (no bad words!)'
        ],
        unique: false,
        minlength: 3,
        maxlength: 100,
        trim: false
    },

    username: {
        type: String,
        required: true,
        validate: [
            (value) => {

                if (!username.test(value)){
                    return false;
                }

                if (isProfane(value)) {
                    return false;
                }

                return true;

            },
            'Please provide a valid name (no bad words!)'
        ],
        unique: true,
        minlength: 4,
        maxlength: 20,
        trim: true
    },

    email: {
        type: String,
        required: true,
        validate: [isEmail, 'Please provide a valid email'],
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 60,
        maxlength: 60
    },

    tokens: [{
        type: String
    }],

    avatar: {
        type: fileSchema,
        required: false
    }

};

module.exports = userDefinition;
