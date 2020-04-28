const { Schema } = require('mongoose');

const parentStudentInvitationDefinition = require('./definition');
const { parentStudentInvitation } = require('../../names');

const schemaOpts = {
    collection: parentStudentInvitation.collectionName
};

const parentStudentInvitationSchema = new Schema(parentStudentInvitationDefinition, schemaOpts);

parentStudentInvitationSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = parentStudentInvitationSchema;
