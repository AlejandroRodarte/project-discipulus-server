const { aggregation } = require('../../../db');
const { modelErrorMessages } = require('../../errors');

const generateGetTaskValidationData = (pipelineObj) => async function() {

    const doc = this;
    const Model = doc.constructor;

    const docs = await Model.aggregate(aggregation.sharedPipelines.getTaskValidationData(pipelineObj));

    if (!docs.length) {
        throw new Error(modelErrorMessages.taskValidationDataNotFound);
    }

    const [validationData] = docs;

    return validationData;

};

module.exports = generateGetTaskValidationData;
