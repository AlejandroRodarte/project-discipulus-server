const { Schema } = require('mongoose');

const { errors, models } = require('../../../util');
const { storage } = require('../../../api');
const { db, roles } = require('../../../shared');

const classDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.class.collectionName
};

const classSchema = new Schema(classDefinition, schemaOpts);

classSchema.index({ user: 1, title: 1 }, { unique: true });

classSchema.virtual('students', {
    ref: db.names.classStudent.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('invitations', {
    ref: db.names.classStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('unknownInvitations', {
    ref: db.names.classUnknownStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('files', {
    ref: db.names.classFile.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('notes', {
    ref: db.names.classNote.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('sessions', {
    ref: db.names.session.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('homeworks', {
    ref: db.names.homework.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.pre('remove', async function() {

    const clazz = this;

    if (clazz.avatar) {

        try {
            await storage.deleteBucketObjects(storage.config.bucketNames[db.names.class.modelName], [clazz.avatar.keyname]);
        } catch (e) {
            throw e;
        }

    }

    try {
        await applyDeletionRules(clazz, models.class.deletionClassRules);
    } catch (e) {
        throw e;
    }

});

classSchema.statics.findByIdAndCheckForSelfAssociation = async function({ classId, studentId }) {

    const Class = this;

    const clazz = await Class.findOne({ _id: classId });

    if (!clazz) {
        throw new Error(errors.modelErrorMessages.classNotFound);
    }

    if (clazz.user.toHexString() === studentId.toHexString()) {
        throw new Error(errors.modelErrorMessages.selfTeaching);
    }

    return clazz;

};

classSchema.methods.checkAndSave = async function() {

    const clazz = this;
    const User = clazz.model(db.names.user.modelName);

    try {

        await User.findByIdAndValidateRole(clazz.user, roles.ROLE_TEACHER, {
            notFoundErrorMessage: errors.modelErrorMessages.teacherNotFound,
            invalidRoleErrorMessage: errors.modelErrorMessages.notATeacher
        });

        await clazz.save();

    } catch (e) {
        throw e;
    }

    return clazz;

};

classSchema.methods.saveAvatar = async function(avatarDoc, buffer) {

    const clazz = this;

    if (clazz.avatar) {

        try {
            await storage.deleteBucketObjects(storage.config.bucketNames[db.names.class.modelName], [clazz.avatar.keyname]);
        } catch (e) {
            throw e;
        }

    }

    clazz.avatar = avatarDoc;

    try {
        await clazz.save();
    } catch (e) {
        throw e;
    }

    try {
        await storage.createMultipartObject(storage.config.bucketNames[db.names.class.modelName], {
            keyname: clazz.avatar.keyname,
            buffer,
            size: buffer.length,
            mimetype: clazz.avatar.mimetype
        });
    } catch (e) {

        clazz.avatar = undefined;
        await clazz.save();

        throw e;

    }

    return clazz;

};

classSchema.methods.getEnabledStudentIds = async function() {

    const clazz = this;
    const ClassStudent = clazz.model(db.names.classStudent.modelName);

    const pipeline = db.aggregation.classStudentPipelines.getEnabledClassStudentIds(clazz._id);
    const docs = await ClassStudent.aggregate(pipeline);

    if (!docs.length) {
        throw new Error(errors.modelErrorMessages.noClassStudents);
    }

    const [uniqueClass] = docs;

    return uniqueClass.studentIds;

};

module.exports = classSchema;
