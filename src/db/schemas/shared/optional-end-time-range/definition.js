const moment = require('moment');

const sharedOptionalEndTimeRangeDefinition = {

    start: {
        type: Number,
        required: false,
        default: moment().utc().unix()
    },

    end: {
        type: Number,
        required: false,
        validate: [
            function(value) {
                return this.start < value;
            },
            'End date should be greater than start date'
        ]
    }

};

module.exports = sharedOptionalEndTimeRangeDefinition;
