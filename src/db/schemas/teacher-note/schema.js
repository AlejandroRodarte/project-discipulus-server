const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { roles, models } = require('../../../util');

const teacherNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.teacherNote.collectionName
};

const teacherNoteSchema = new Schema(teacherNoteDefinition, schemaOpts);

teacherNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

teacherNoteSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateUserAndRoleValidator(roles.ROLE_TEACHER));

module.exports = teacherNoteSchema;
