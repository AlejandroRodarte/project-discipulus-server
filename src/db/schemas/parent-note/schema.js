const { Schema } = require('mongoose');

const parentNoteDefinition = require('./definition');
const { parentNote } = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: parentNote.collectionName
};

const parentNoteSchema = new Schema(parentNoteDefinition, schemaOpts);

parentNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

parentNoteSchema.methods.checkAndSave = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.generateUserAndRoleValidator(roleTypes.ROLE_PARENT));

module.exports = parentNoteSchema;
