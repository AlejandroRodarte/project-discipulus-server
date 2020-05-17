const { Schema } = require('mongoose');

const sessionDefinition = require('./definition');
const names = require('../../names');

const schemaOpts = {
    collection: names.session.collectionName
};

const sessionSchema = new Schema(sessionDefinition, schemaOpts);

sessionSchema.index({ class: 1, title: 1 }, { unique: true });

module.exports = sessionSchema;