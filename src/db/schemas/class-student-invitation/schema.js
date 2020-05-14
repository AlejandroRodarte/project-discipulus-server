const { Schema } = require('mongoose');

const classStudentInvitationDefinition = require('./definition');
const names = require('../../names');

const roleTypes = require('../../../util/roles');

const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: classStudentInvitation.collectionName
};

const classStudentInvitationSchema = new Schema(classStudentInvitationDefinition, schemaOpts);

classStudentInvitationSchema.index({ class: 1, user: 1 }, { unique: true });

classStudentInvitationSchema.methods.checkAndSave = async function() {

    const classStudentInvitation = this;

    const User = classStudentInvitation.model(names.user.modelName);
    const Class = classStudentInvitation.model(names.class.modelName);
    const ClassStudent = classStudentInvitation.model(names.classStudent.modelName);

    try {
        await User.findByIdAndValidateRole(classStudentInvitation.user, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });
    } catch (e) {
        throw e;
    }

    const clazz = await Class.findOne({ _id: classStudentInvitation.class });

    if (clazz.user.toHexString() === classStudentInvitation.user.toHexString()) {
        throw new Error(modelErrorMessages.selfTeaching);
    }

    const classStudentExists = await ClassStudent.exists({
        class: classStudentInvitation.class,
        user: classStudentInvitation.user
    });

    if (!classStudentExists) {
        throw new Error(modelErrorMessages.classStudentAlreadyExists);
    }

    try {
        await classStudentInvitation.save();
    } catch (e) {
        throw e;
    }

    return classStudentInvitation;

};

module.exports = classStudentInvitationSchema;