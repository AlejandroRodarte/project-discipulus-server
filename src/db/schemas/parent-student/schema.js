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

    const parentUser = await User.findOne({
        _id: parent,
        enabled: true
    });

    if (!parentUser) {
        throw new Error(modelErrorMessages.parentNotFound);
    }

    const isParent = await parentUser.hasRole(roleTypes.ROLE_PARENT);

    if (!isParent) {
        throw new Error(modelErrorMessages.notAParent);
    }

    const studentUser = await User.findOne({
        _id: student,
        enabled: true
    });

    if (!studentUser) {
        throw new Error(modelErrorMessages.studentNotFound);
    }

    const isStudent = await studentUser.hasRole(roleTypes.ROLE_STUDENT);

    if (!isStudent) {
        throw new Error(modelErrorMessages.notAStudent);
    }

    const invitation = await ParentStudentInvitation.findOne({
        parent,
        student
    });

    if (!invitation) {
        throw new Error(modelErrorMessages.parentStudentInvitationRequired);
    }

    try {
        await parentStudent.save();
        await invitation.remove();
    } catch (e) {
        throw e;
    }

    return parentStudent;

};

module.exports = parentStudentSchema;
