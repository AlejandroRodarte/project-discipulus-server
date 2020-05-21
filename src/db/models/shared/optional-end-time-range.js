const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedOptionalEndTimeRange = getModel(db.names.sharedOptionalEndTimeRange.modelName, shared.schemas.sharedOptionalEndTimeRangeSchema);

module.exports = SharedOptionalEndTimeRange;