const { Schema } = require('mongoose');

const regexp = require('../../util/regexp');
const badWordsFilter = require('../../util/filter/bad-words-filter');

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        validate: [
            (value) => {

                if (value.match(regexp.fullName)){
                    return false;
                }

                if (badWordsFilter.isProfane(value)) {
                    return false;
                }

                return true;

            },
            'Please provide a valid name (no bad words!)'
        ]
        
    }

});

module.exports = userSchema;
