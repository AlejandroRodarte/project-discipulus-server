const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedTimeRangeDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedTimeRange.collectionName
};

const sharedTimeRangeSchema = new Schema(sharedTimeRangeDefinition, schemaOpts);

sharedTimeRangeSchema.virtual('duration').get(function() {
    const timeRange = this;
    return timeRange.end - timeRange.start;
});

module.exports = sharedTimeRangeSchema;
