const moment = require('moment');

const generateTaskValidator = ({ alreadyCompleteErrorMessage, expiredErrorMessage, notAvailableErrorMessage }) => async (doc) => {
        
    try {

        const { completed, forced, end, published } = await doc.getTaskValidationData();

        if (completed) {
            throw new Error(alreadyCompleteErrorMessage);
        }

        if (!published) {
            throw new Error(notAvailableErrorMessage);
        }

        if (!forced && (end && moment().utc().unix() > end)) {
            throw new Error(expiredErrorMessage);
        }

    } catch (e) {
        throw e;
    }

};

module.exports = generateTaskValidator;
