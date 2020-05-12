const { Schema } = require('mongoose');

const parentStudentDefinition = require('./definition');
const { parentStudent, user, parentStudentInvitation } = require('../../names');

const roleTypes = require('../../../util/roles');

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
        throw new Error('Self-association is denied');
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

    const invitation = await ParentStudentInvitation.findOne({
        parent,
        student
    });

    if (!invitation) {
        throw new Error('An invitation is required before performing a parent/student association');
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
