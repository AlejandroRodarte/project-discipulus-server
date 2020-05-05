const moment = require('moment');

const sharedTimeRangeDefinition = {

    start: {
        type: Number,
        required: false,
        default: moment().utc().unix(),
        min: [0, 'Please provide a valid starting date']
    },

    end: {
        type: Number,
        required: [true, 'Please provide an end date'],
        validate: [
            function(value) {
                return this.start < value;
            },
            'End date should be greater than start date'
        ]
    }

};

module.exports = sharedTimeRangeDefinition;
