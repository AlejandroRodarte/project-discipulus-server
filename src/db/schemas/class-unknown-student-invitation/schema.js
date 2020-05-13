const { Schema } = require('mongoose');

const classUnknownStudentInvitationDefinition = require('./definition');
const { classUnknownStudentInvitation } = require('../../names');

const schemaOpts = {
    collection: classUnknownStudentInvitation.collectionName
};

const classUnknownStudentInvitationSchema = new Schema(classUnknownStudentInvitationDefinition, schemaOpts);

classUnknownStudentInvitationSchema.index({ class: 1, email: 1 }, { unique: true });

module.exports = classUnknownStudentInvitationSchema;