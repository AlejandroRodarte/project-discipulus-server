const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const userEventDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.userEvent.collectionName
};

const userEventSchema = new Schema(userEventDefinition, schemaOpts);

userEventSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = userEventSchema;
