const { Schema } = require('mongoose');

const roleTypes = require('../../../util/roles');

const parentStudentInvitationDefinition = require('./definition');
const { parentStudentInvitation, parentStudent, user } = require('../../names');

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
        throw new Error('Self-association is denied');
    }

    const studentUser = await User.findOne({
        _id: student,
        enabled: true
    });

    if (!studentUser) {
        throw new Error('The student deleted/disabled his/her account');
    }

    const isStudent = await studentUser.hasRole(roleTypes.ROLE_STUDENT);

    if (!isStudent) {
        throw new Error('The user is not a student');
    }

    const parentUser = await User.findOne({
        _id: parent,
        enabled: true
    });

    if (!parentUser) {
        throw new Error('The parent deleted/disabled his/her account');
    }

    const isParent = await parentUser.hasRole(roleTypes.ROLE_PARENT);

    if (!isParent) {
        throw new Error('The user is not a parent');
    }

    const parentStudentExists = await ParentStudent.exists({
        parent,
        student
    });

    if (parentStudentExists) {
        throw new Error('An association already has been established');
    }

    try {
        await parentStudentInvitation.save();
    } catch (e) {
        throw e;
    }

    return parentStudentInvitation;

};

module.exports = parentStudentInvitationSchema;
