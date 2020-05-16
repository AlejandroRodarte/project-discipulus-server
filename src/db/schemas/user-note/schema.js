const { Schema } = require('mongoose');

const userNoteDefinition = require('./definition');
const { userNote } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const schemaOpts = {
    collection: userNote.collectionName
};

const userNoteSchema = new Schema(userNoteDefinition, schemaOpts);

userNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

userNoteSchema.methods.saveFileAndDoc = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.userExistsValidator);

module.exports = userNoteSchema;
