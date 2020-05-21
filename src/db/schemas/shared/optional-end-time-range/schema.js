const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedOptionalEndTimeRangeDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedOptionalEndTimeRange.collectionName
};

const sharedOptionalTimeRangeSchema = new Schema(sharedOptionalEndTimeRangeDefinition, schemaOpts);

sharedOptionalTimeRangeSchema.virtual('duration').get(function() {
    const timeRange = this;
    return timeRange.end !== undefined ? timeRange.end - timeRange.start : undefined;
});

module.exports = sharedOptionalTimeRangeSchema;
