const { Schema } = require('mongoose');

const teacherNoteDefinition = require('./definition');
const { teacherNote } = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: teacherNote.collectionName
};

const teacherNoteSchema = new Schema(teacherNoteDefinition, schemaOpts);

teacherNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

teacherNoteSchema.methods.checkAndSave = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.generateUserAndRoleValidator(roleTypes.ROLE_TEACHER));

module.exports = teacherNoteSchema;
