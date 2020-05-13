const { Schema } = require('mongoose');

const roleTypes = require('../../../util/roles');

const parentStudentInvitationDefinition = require('./definition');
const { parentStudentInvitation, parentStudent, user } = require('../../names');

const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: parentStudentInvitation.collectionName
};

const parentStudentInvitationSchema = new Schema(parentStudentInvitationDefinition, schemaOpts);

parentStudentInvitationSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentInvitationSchema.methods.checkAndSave = async function() {

    const parentStudentInvitation = this;
    const User = parentStudentInvitation.model(user.modelName);
    const ParentStudent = parentStudentInvitation.model(parentStudent.modelName);

    const { parent, student } = parentStudentInvitation;

    if (parent.toHexString() === student.toHexString()) {
        throw new Error(modelErrorMessages.selfAssociation);
    }

    try {

        await User.findByIdAndValidateRole(student, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

        await User.findByIdAndValidateRole(parent, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAParent
        });

    } catch (e) {
        throw e;
    }

    const parentStudentExists = await ParentStudent.exists({
        parent,
        student
    });

    if (parentStudentExists) {
        throw new Error(modelErrorMessages.parentStudentAlreadyExists);
    }

    try {
        await parentStudentInvitation.save();
    } catch (e) {
        throw e;
    }

    return parentStudentInvitation;

};

module.exports = parentStudentInvitationSchema;
