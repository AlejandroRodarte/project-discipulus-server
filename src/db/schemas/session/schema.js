const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models } = require('../../../util');

const sessionDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.session.collectionName
};

const sessionSchema = new Schema(sessionDefinition, schemaOpts);

sessionSchema.index({ class: 1, title: 1 }, { unique: true });

sessionSchema.virtual('sessionFiles', {
    ref: db.names.sessionFile.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.virtual('sessionNotes', {
    ref: db.names.sessionNote.modelName,
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

module.exports = sessionSchema;