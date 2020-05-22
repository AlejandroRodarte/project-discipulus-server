const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models } = require('../../../util');

const userNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.userNote.collectionName
};

const userNoteSchema = new Schema(userNoteDefinition, schemaOpts);

userNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

userNoteSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.userExistsValidator);

module.exports = userNoteSchema;
