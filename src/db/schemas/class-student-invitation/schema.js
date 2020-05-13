const { Schema } = require('mongoose');

const classStudentInvitationDefinition = require('./definition');
const { classStudentInvitation } = require('../../names');

const schemaOpts = {
    collection: classStudentInvitation.collectionName
};

const classStudentInvitationSchema = new Schema(classStudentInvitationDefinition, schemaOpts);

classStudentInvitationSchema.index({ class: 1, user: 1 }, { unique: true });

module.exports = classStudentInvitationSchema;