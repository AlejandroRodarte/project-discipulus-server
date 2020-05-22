const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { roles, models } = require('../../../util');

const studentNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.studentNote.collectionName
};

const studentNoteSchema = new Schema(studentNoteDefinition, schemaOpts);

studentNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

studentNoteSchema.methods.checkAndSave = models.common.generateSimpleCheckAndSave(models.common.generateUserAndRoleValidator(roles.ROLE_STUDENT));

module.exports = studentNoteSchema;
