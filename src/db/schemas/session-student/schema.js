const { Schema } = require('mongoose');

const { db } = require('../../../shared');

const sessionStudentDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sessionStudent.collectionName
};

const sessionStudentSchema = new Schema(sessionStudentDefinition, schemaOpts);

sessionStudentSchema.index({ classStudent: 1, session: 1 }, { unique: true });

module.exports = sessionStudentSchema;