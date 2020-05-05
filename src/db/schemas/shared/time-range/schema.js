const { Schema } = require('mongoose');

const sharedTimeRangeDefinition = require('./definition');
const { sharedTimeRange } = require('../../../names');

const schemaOpts = {
    collection: sharedTimeRange.collectionName
};

const sharedTimeRangeSchema = new Schema(sharedTimeRangeDefinition, schemaOpts);

sharedTimeRangeSchema.virtual('duration').get(function() {
    const timeRange = this;
    return timeRange.end - timeRange.start;
});

module.exports = sharedTimeRangeSchema;
