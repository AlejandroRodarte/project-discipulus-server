const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const sessionDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.session.collectionName
};

const sessionSchema = new Schema(sessionDefinition, schemaOpts);

sessionSchema.index({ class: 1, title: 1 }, { unique: true });

sessionSchema.virtual('files', {
    ref: db.names.sessionFile.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.virtual('notes', {
    ref: db.names.sessionNote.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.virtual('students', {
    ref: db.names.sessionStudent.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.pre('remove', async function() {

    const session = this;

    try {
        await applyDeletionRules(session, models.session.deletionSessionRules);
    } catch (e) {
        throw e;
    }

});

sessionSchema.methods.saveAndAddStudents = models.common.generateSaveAndAddStudents({
    studentModelName: db.names.sessionStudent.modelName,
    foreignField: 'session'
});

module.exports = sessionSchema;