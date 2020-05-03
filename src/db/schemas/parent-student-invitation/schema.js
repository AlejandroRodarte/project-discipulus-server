const { Schema, model } = require('mongoose');

const { user } = require('../../names');

const roleTypes = require('../../../util/roles');

const parentStudentInvitationDefinition = require('./definition');
const { parentStudentInvitation } = require('../../names');

const schemaOpts = {
    collection: parentStudentInvitation.collectionName
};

const parentStudentInvitationSchema = new Schema(parentStudentInvitationDefinition, schemaOpts);

parentStudentInvitationSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentInvitationSchema.methods.checkAndSave = async function() {

    const parentStudentInvitation = this;
    const User = model(user.modelName);

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
        throw new Error('The user is not a parent');
    }

    try {
        await parentStudentInvitation.save();
    } catch (e) {
        throw e;
    }

    return parentStudentInvitation;

};

module.exports = parentStudentInvitationSchema;
