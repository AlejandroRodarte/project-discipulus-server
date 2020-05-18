const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { roles, models } = require('../../../util');

const parentNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.parentNote.collectionName
};

const parentNoteSchema = new Schema(parentNoteDefinition, schemaOpts);

parentNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

parentNoteSchema.methods.checkAndSave = models.common.generateNoteCheckAndSave(models.common.generateUserAndRoleValidator(roles.ROLE_PARENT));

module.exports = parentNoteSchema;
