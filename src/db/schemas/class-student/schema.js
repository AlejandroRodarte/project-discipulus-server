const { Schema } = require('mongoose');

const classStudentDefinition = require('./definition');
const names = require('../../names');

const roleTypes = require('../../../util/roles');

const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.classStudent.collectionName
};

const classStudentSchema = new Schema(classStudentDefinition, schemaOpts);

classStudentSchema.index({ class: 1, user: 1 }, { unique: true });

classStudentSchema.methods.checkUser = async function() {

    const classStudent = this;
    const User = classStudent.model(names.user.modelName);
    const Class = classStudent.model(names.class.modelName);

    try {

        const user = await User.findByIdAndValidateRole(classStudent.user, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

        await Class.findByIdAndCheckForSelfAssociation({
            classId: classStudent.class,
            studentId: classStudent.user
        });

        return user;

    } catch (e) {
        throw e;
    }

};

classStudentSchema.methods.checkKnownInvitationAndSave = async function() {

    const classStudent = this;
    const ClassStudentInvitation = classStudent.model(names.classStudentInvitation.modelName);

    try {

        await classStudent.checkUser();

        const classStudentInvitation = await ClassStudentInvitation.findOne({
            class: classStudent.class,
            user: classStudent.user
        });

        if (!classStudentInvitation) {
            throw new Error(modelErrorMessages.classStudentInvitationRequired);
        }

        await classStudentInvitation.remove();
        await classStudent.save();

    } catch (e) {
        throw e;
    }

    return classStudent;

};

classStudentSchema.methods.checkUnknownInvitationAndSave = async function() {

    const classStudent = this;
    const ClassUnknownStudentInvitation = classStudent.model(names.classUnknownStudentInvitation.modelName);

    try {

        const student = await classStudent.checkUser();

        const classUnknownStudentInvitation = await ClassUnknownStudentInvitation.findOne({
            class: classStudent.class,
            email: student.email
        });

        if (!classUnknownStudentInvitation) {
            throw new Error(modelErrorMessages.classUnknownStudentInvitationRequired);
        }

        await classUnknownStudentInvitation.remove();
        await classStudent.save();

    } catch (e) {
        throw e;
    }

    return classStudent;

};

module.exports = classStudentSchema;