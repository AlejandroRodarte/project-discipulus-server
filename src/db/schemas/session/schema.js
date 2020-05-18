const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const sessionDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.session.collectionName
};

const sessionSchema = new Schema(sessionDefinition, schemaOpts);

sessionSchema.index({ class: 1, title: 1 }, { unique: true });

module.exports = sessionSchema;