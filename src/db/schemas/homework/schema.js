const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const homeworkDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homework.collectionName
};

const homeworkSchema = new Schema(homeworkDefinition, schemaOpts);

homeworkSchema.index({ class: 1, title: 1 }, { unique: true });

module.exports = homeworkSchema;