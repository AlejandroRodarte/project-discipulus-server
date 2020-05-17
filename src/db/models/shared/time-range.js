const { shared } = require('../../schemas');
const { sharedTimeRange } = require('../../names');
const getModel = require('../../get-model');

const SharedTimeRange = getModel(sharedTimeRange.modelName, shared.schemas.sharedTimeRangeSchema);

module.exports = SharedTimeRange;