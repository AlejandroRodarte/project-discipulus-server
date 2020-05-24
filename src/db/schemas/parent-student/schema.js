const { Schema } = require('mongoose');

const { db, roles } = require('../../../shared');
const { errors } = require('../../../util');

const parentStudentDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.parentStudent.collectionName
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentSchema.methods.checkAndSave = async function() {

    const parentStudent = this;
    const User = parentStudent.model(db.names.user.modelName);
    const ParentStudentInvitation = parentStudent.model(db.names.parentStudentInvitation.modelName);

    const { parent, student } = parentStudent;

    if (parent.toHexString() === student.toHexString()) {
        throw new Error(errors.modelErrorMessages.selfAssociation);
    }

    try {

        await User.findByIdAndValidateRole(parent, roles.ROLE_PARENT, {
            notFoundErrorMessage: errors.modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notAParent
        });

        await User.findByIdAndValidateRole(student, roles.ROLE_STUDENT, {
            notFoundErrorMessage: errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notAStudent
        });

        const invitation = await ParentStudentInvitation.findOne({
            parent,
            student
        });
    
        if (!invitation) {
            throw new Error(errors.modelErrorMessages.parentStudentInvitationRequired);
        }

        await invitation.remove();
        await parentStudent.save();

    } catch (e) {
        throw e;
    }

    return parentStudent;

};

module.exports = parentStudentSchema;
