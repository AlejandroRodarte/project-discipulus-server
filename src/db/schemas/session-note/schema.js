
const { Schema } = require('mongoose');

const sessionNoteDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.sessionNote.collectionName
};

const sessionNoteSchema = new Schema(sessionNoteDefinition, schemaOpts);

sessionNoteSchema.index({ session: 1, 'note.title': 1 }, { unique: true });

sessionNoteSchema.methods.checkAndSave = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.generateParentDocExistsValidator({
    parentModelName: names.session.modelName,
    ref: 'session',
    notFoundErrorMessage: modelErrorMessages.sessionNotFound
}));

module.exports = sessionNoteSchema;