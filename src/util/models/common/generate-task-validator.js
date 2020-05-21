const generateTaskValidator = ({ alreadyCompleteErrorMessage, expiredErrorMessage }) => async (doc) => {
        
    try {

        const { completed, forced, end } = await doc.getTaskValidationData();

        if (completed) {
            throw new Error(alreadyCompleteErrorMessage);
        }

        if (!forced && (end && moment().utc().unix() > end)) {
            throw new Error(expiredErrorMessage);
        }

    } catch (e) {
        throw e;
    }

};

module.exports = generateTaskValidator;
