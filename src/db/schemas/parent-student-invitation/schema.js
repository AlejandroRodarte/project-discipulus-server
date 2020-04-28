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

parentStudentInvitationSchema.statics.add = async function(parentStudentInvitationDoc) {

    const ParentStudentInvitation = this;
    const User = model(user.modelName);

    const { parent: parentId, student: studentId } = parentStudentInvitationDoc;

    if (parentId.toString() === studentId.toString()) {
        throw new Error('Self-association is denied');
    }

    const student = await User.findOne({
        _id: studentId,
        enabled: true
    });

    if (!student) {
        throw new Error('The student deleted/disabled his/her account');
    }

    const isStudent = await student.hasRole(roleTypes.ROLE_STUDENT);

    if (!isStudent) {
        throw new Error('The user is not a parent');
    }

    const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

    try {
        await parentStudentInvitation.save();
    } catch (e) {
        throw e;
    }

    return parentStudentInvitation;

};

module.exports = parentStudentInvitationSchema;
