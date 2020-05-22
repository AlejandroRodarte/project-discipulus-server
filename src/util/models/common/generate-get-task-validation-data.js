const { db } = require('../../../shared');
const { modelErrorMessages } = require('../../errors');

const generateGetTaskValidationData = (pipelineObj) => async function() {

    const doc = this;
    const Model = doc.constructor;

    const docs = await Model.aggregate(db.aggregation.sharedPipelines.getTaskValidationData(doc._id, pipelineObj));

    if (!docs.length) {
        throw new Error(modelErrorMessages.taskValidationDataNotFound);
    }

    const [validationData] = docs;

    return validationData;

};

module.exports = generateGetTaskValidationData;
