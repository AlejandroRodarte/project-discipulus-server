const moment = require('moment');

const generateDueDateUploadValidator = ({ parentModelName, ref, notFoundErrorMessage, taskExpiredErrorMessage }) => async (fileDoc) => {
        
    const ParentModel = fileDoc.model(parentModelName);

    const parentDoc = await ParentModel.findOne({
        _id: fileDoc[ref]
    });

    if (!parentDoc) {
        throw new Error(notFoundErrorMessage);
    }

    if (parentDoc.timeRange && parentDoc.timeRange.end && moment().utc().unix() <= parentDoc.timeRange.end) {
        return;
    }

    throw new Error(taskExpiredErrorMessage);

};

module.exports = generateDueDateUploadValidator;
