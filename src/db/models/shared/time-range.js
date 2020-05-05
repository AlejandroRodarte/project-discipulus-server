const db = require('../../../db');
const { sharedTimeRangeSchema } = require('../../schemas/shared/time-range');

const { sharedTimeRange } = require('../../names');

const SharedTimeRange = db.getModel(sharedTimeRange.modelName, sharedTimeRangeSchema);

module.exports = SharedTimeRange;