const { Schema } = require('mongoose');

const classDefinition = require('./definition');
const names = require('../../names');

const roleTypes = require('../../../util/roles');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const { modelErrorMessages } = require('../../../util/errors');

const deletionClassRules = require('../../../util/models/class/deletion-class-rules');

const deleteModes = require('../../../util/delete-modes');

const schemaOpts = {
    collection: names.class.collectionName
};

const classSchema = new Schema(classDefinition, schemaOpts);

classSchema.index({ user: 1, title: 1 }, { unique: true });

classSchema.virtual('classstudents', {
    ref: names.classStudent.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('classstudentinvitations', {
    ref: names.classStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'class'
});

classSchema.virtual('classunknownstudentinvitations', {
    ref: names.classUnknownStudentInvitation.modelName,
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

        for (const rule of deletionClassRules) {
            
            if (rule.deleteFiles) {

                const fileDocs = await user.model(rule.modelName).find({
                    [rule.fieldName]: clazz._id
                });

                const keynames = fileDocs.map(fileDoc => fileDoc.file.keyname)

                await storageApi.deleteBucketObjects(bucketNames[rule.modelName], keynames);

            }

            switch (rule.deleteMode) {

                case deleteModes.DELETE_MANY:

                    await clazz.model(rule.modelName).deleteMany({
                        [rule.fieldName]: clazz._id
                    });

                    break;

                case deleteModes.REMOVE:

                    const docs = await clazz.model(rule.modelName).find({
                        [rule.fieldName]: clazz._id
                    });

                    for (const doc of docs) {
                        await doc.remove();
                    }

                    break;

                default:
                    break;

            }

        }

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
