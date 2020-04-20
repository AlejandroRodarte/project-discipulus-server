const { Schema } = require('mongoose');
const validator = require('validator').default;

const fileSchema = require('./file');

const regexp = require('../../util/regexp');
const badWordsFilter = require('../../util/filter/bad-words-filter');

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        validate: [
            (value) => {

                if (!regexp.fullName.test(value) || !regexp.singleName.test(value)){
                    return false;
                }

                if (badWordsFilter.isProfane(value)) {
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

                if (!regexp.username.test(value)){
                    return false;
                }

                if (badWordsFilter.isProfane(value)) {
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
        validate: [
            (value) => validator.isEmail(value),
            'Please provide a valid email'
        ],
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

});

module.exports = userSchema;
