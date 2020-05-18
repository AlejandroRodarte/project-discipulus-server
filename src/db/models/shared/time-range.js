const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedTimeRange = getModel(db.names.sharedTimeRange.modelName, shared.schemas.sharedTimeRangeSchema);

module.exports = SharedTimeRange;