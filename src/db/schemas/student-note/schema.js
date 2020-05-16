const { Schema } = require('mongoose');

const studentNoteDefinition = require('./definition');
const { studentNote } = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: studentNote.collectionName
};

const studentNoteSchema = new Schema(studentNoteDefinition, schemaOpts);

studentNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

studentNoteSchema.methods.saveFileAndDoc = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.generateUserAndRoleValidator(roleTypes.ROLE_STUDENT));

module.exports = studentNoteSchema;
