const { Schema } = require('mongoose');

const classDefinition = require('./definition');
const names = require('../../names');

const roleTypes = require('../../../util/roles');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const { modelErrorMessages } = require('../../../util/errors');

const deletionClassRules = require('../../../util/models/class/deletion-class-rules');

const { applyDeletionRules } = require('../../../db');

const schemaOpts = {
    collection: names.class.collectionName
};

const classSchema = new Schema(classDefinition, schemaOpts);

classSchema.index({ user: 1, title: 1 }, { unique: true });

classSchema.virtual('classStudents', {
    ref: names.classStudent.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('classStudentInvitations', {
    ref: names.classStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('classUnknownStudentInvitations', {
    ref: names.classUnknownStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('classFiles', {
    ref: names.classFile.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('classNotes', {
    ref: names.classNote.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.pre('remove', async function() {

    const clazz = this;

    if (clazz.avatar) {

        try {
            await storageApi.deleteBucketObjects(bucketNames[names.class.modelName], [clazz.avatar.keyname]);
        } catch (e) {
            throw e;
        }

    }

    try {
        await applyDeletionRules(clazz, deletionClassRules);
    } catch (e) {
        throw e;
    }

});

classSchema.statics.findByIdAndCheckForSelfAssociation = async function({ classId, studentId }) {

    const Class = this;

    const clazz = await Class.findOne({ _id: classId });

    if (!clazz) {
        throw new Error(modelErrorMessages.classNotFound);
    }

    if (clazz.user.toHexString() === studentId.toHexString()) {
        throw new Error(modelErrorMessages.selfTeaching);
    }

    return clazz;

};

classSchema.methods.checkAndSave = async function() {

    const clazz = this;
    const User = clazz.model(names.user.modelName);

    try {

        await User.findByIdAndValidateRole(clazz.user, roleTypes.ROLE_TEACHER, {
            notFoundErrorMessage: modelErrorMessages.teacherNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notATeacher
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
            await storageApi.deleteBucketObjects(bucketNames[names.class.modelName], [clazz.avatar.keyname]);
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
        await storageApi.createMultipartObject(bucketNames[names.class.modelName], {
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

module.exports = classSchema;
