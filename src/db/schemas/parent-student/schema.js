const { Schema } = require('mongoose');

const parentStudentDefinition = require('./definition');
const { parentStudent, user, parentStudentInvitation } = require('../../names');

const roleTypes = require('../../../util/roles');

const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: parentStudent.collectionName
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentSchema.methods.checkAndSave = async function() {

    const parentStudent = this;
    const User = parentStudent.model(user.modelName);
    const ParentStudentInvitation = parentStudent.model(parentStudentInvitation.modelName);

    const { parent, student } = parentStudent;

    if (parent.toHexString() === student.toHexString()) {
        throw new Error(modelErrorMessages.selfAssociation);
    }

    try {

        await User.findByIdAndValidateRole(parent, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAParent
        });

        await User.findByIdAndValidateRole(student, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

        const invitation = await ParentStudentInvitation.findOne({
            parent,
            student
        });
    
        if (!invitation) {
            throw new Error(modelErrorMessages.parentStudentInvitationRequired);
        }

        await parentStudent.save();
        await invitation.remove();

    } catch (e) {
        throw e;
    }

    return parentStudent;

};

module.exports = parentStudentSchema;
