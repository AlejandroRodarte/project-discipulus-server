const { Schema } = require('mongoose');

const { db, roles } = require('../../../shared');
const { errors } = require('../../../util');

const classStudentInvitationDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.classStudentInvitation.collectionName
};

const classStudentInvitationSchema = new Schema(classStudentInvitationDefinition, schemaOpts);

classStudentInvitationSchema.index({ class: 1, user: 1 }, { unique: true });

classStudentInvitationSchema.methods.checkAndSave = async function() {

    const classStudentInvitation = this;

    const User = classStudentInvitation.model(db.names.user.modelName);
    const Class = classStudentInvitation.model(db.names.class.modelName);
    const ClassStudent = classStudentInvitation.model(db.names.classStudent.modelName);

    try {

        await User.findByIdAndValidateRole(classStudentInvitation.user, roles.ROLE_STUDENT, {
            notFoundErrorMessage: errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notAStudent
        });

        await Class.findByIdAndCheckForSelfAssociation({
            classId: classStudentInvitation.class,
            studentId: classStudentInvitation.user
        });

        const classStudentExists = await ClassStudent.exists({
            class: classStudentInvitation.class,
            user: classStudentInvitation.user
        });
    
        if (classStudentExists) {
            throw new Error(errors.modelErrorMessages.classStudentAlreadyExists);
        }

        await classStudentInvitation.save();

        return classStudentInvitation;

    } catch (e) {
        throw e;
    }

};

module.exports = classStudentInvitationSchema;