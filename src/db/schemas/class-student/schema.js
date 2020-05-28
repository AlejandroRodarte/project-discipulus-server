const { Schema } = require('mongoose');

const { db, roles } = require('../../../shared');
const { errors, models } = require('../../../util');

const classStudentDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.classStudent.collectionName
};

const classStudentSchema = new Schema(classStudentDefinition, schemaOpts);

classStudentSchema.index({ class: 1, user: 1 }, { unique: true });

classStudentSchema.virtual('files', {
    ref: db.names.classStudentFile.modelName,
    localField: '_id',
    foreignField: 'classStudent'
});

classStudentSchema.virtual('notes', {
    ref: db.names.classStudentNote.modelName,
    localField: '_id',
    foreignField: 'classStudent'
});

classStudentSchema.virtual('sessions', {
    ref: db.names.sessionStudent.modelName,
    localField: '_id',
    foreignField: 'classStudent'
});

classStudentSchema.virtual('homeworks', {
    ref: db.names.homeworkStudent.modelName,
    localField: '_id',
    foreignField: 'classStudent'
});

classStudentSchema.pre('remove', async function() {

    const classStudent = this;

    try {
        await applyDeletionRules(classStudent, models.classStudent.deletionClassStudentRules);
    } catch {
        throw e;
    }

});

classStudentSchema.methods.checkUser = async function() {

    const classStudent = this;
    const User = classStudent.model(db.names.user.modelName);
    const Class = classStudent.model(db.names.class.modelName);

    try {

        const user = await User.findByIdAndValidateRole(classStudent.user, roles.ROLE_STUDENT, {
            notFoundErrorMessage: errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notAStudent
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
    const ClassStudentInvitation = classStudent.model(db.names.classStudentInvitation.modelName);

    try {

        await classStudent.checkUser();

        const classStudentInvitation = await ClassStudentInvitation.findOne({
            class: classStudent.class,
            user: classStudent.user
        });

        if (!classStudentInvitation) {
            throw new Error(errors.modelErrorMessages.classStudentInvitationRequired);
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
    const ClassUnknownStudentInvitation = classStudent.model(db.names.classUnknownStudentInvitation.modelName);

    try {

        const student = await classStudent.checkUser();

        const classUnknownStudentInvitation = await ClassUnknownStudentInvitation.findOne({
            class: classStudent.class,
            email: student.email
        });

        if (!classUnknownStudentInvitation) {
            throw new Error(errors.modelErrorMessages.classUnknownStudentInvitationRequired);
        }

        await classUnknownStudentInvitation.remove();
        await classStudent.save();

    } catch (e) {
        throw e;
    }

    return classStudent;

};

classStudentSchema.methods.isStudentEnabled = async function() {

    const classStudent = this;
    const ClassStudent = classStudent.constructor;

    const pipeline = db.aggregation.classStudentPipelines.isStudentEnabled(classStudent._id);
    const docs = await ClassStudent.aggregate(pipeline);

    if (!docs.length) {
        throw new Error(errors.modelErrorMessages.classStudentNotFound);
    }

    const [uniqueClassStudent] = docs;

    return uniqueClassStudent.enabled;

};

classStudentSchema.methods.getPaginatedHomeworkStudentSummaries = async function(restricted, params) {

    const classStudent = this;
    const ClassStudent = classStudent.constructor;

    const pipeline = 
        db.aggregation
            .classStudentPipelines
            .paginated
            .homeworkStudentSummaries
            .getPipeline(classStudent._id, restricted, params);
    
    const docs = await ClassStudent.aggregate(pipeline);

    if (!docs.length) {
        throw new Error(errors.modelErrorMessages.classStudentNotFound);
    }

    const [uniqueClassStudent] = docs;

    return uniqueClassStudent.homeworks;

};

module.exports = classStudentSchema;