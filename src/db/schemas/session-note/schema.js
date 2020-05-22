
const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const sessionNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sessionNote.collectionName
};

const sessionNoteSchema = new Schema(sessionNoteDefinition, schemaOpts);

sessionNoteSchema.index({ session: 1, 'note.title': 1 }, { unique: true });

sessionNoteSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateParentDocExistsValidator({
    parentModelName: db.names.session.modelName,
    ref: 'session',
    notFoundErrorMessage: errors.modelErrorMessages.sessionNotFound
}));

module.exports = sessionNoteSchema;