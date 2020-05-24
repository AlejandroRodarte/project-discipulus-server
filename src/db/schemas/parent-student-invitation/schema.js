const { Schema } = require('mongoose');

const { db, roles } = require('../../../shared');
const { errors } = require('../../../util');

const parentStudentInvitationDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.parentStudentInvitation.collectionName
};

const parentStudentInvitationSchema = new Schema(parentStudentInvitationDefinition, schemaOpts);

parentStudentInvitationSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentInvitationSchema.methods.checkAndSave = async function() {

    const parentStudentInvitation = this;
    const User = parentStudentInvitation.model(db.names.user.modelName);
    const ParentStudent = parentStudentInvitation.model(db.names.parentStudent.modelName);

    const { parent, student } = parentStudentInvitation;

    if (parent.toHexString() === student.toHexString()) {
        throw new Error(errors.modelErrorMessages.selfAssociation);
    }

    try {

        await User.findByIdAndValidateRole(student, roles.ROLE_STUDENT, {
            notFoundErrorMessage: errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notAStudent
        });

        await User.findByIdAndValidateRole(parent, roles.ROLE_PARENT, {
            notFoundErrorMessage: errors.modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notAParent
        });

        const parentStudentExists = await ParentStudent.exists({
            parent,
            student
        });
    
        if (parentStudentExists) {
            throw new Error(errors.modelErrorMessages.parentStudentAlreadyExists);
        }

        await parentStudentInvitation.save();

    } catch (e) {
        throw e;
    }

    return parentStudentInvitation;

};

module.exports = parentStudentInvitationSchema;
