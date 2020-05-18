const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const { db } = require('../../../shared');
const { storage } = require('../../../api');
const { models } = require('../../../util');

const { userRolePipelines } = require('../../aggregation');
const userDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.user.collectionName
};

const userSchema = new Schema(userDefinition, schemaOpts);

userSchema.virtual('userRoles', {
    ref: db.names.userRole.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentStudents', {
    ref: db.names.parentStudent.modelName,
    localField: '_id',
    foreignField: 'parent'
});

userSchema.virtual('studentParents', {
    ref: db.names.parentStudent.modelName,
    localField: '_id',
    foreignField: 'student'
});

userSchema.virtual('parentStudentInvitations', {
    ref: db.names.parentStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'parent'
});

userSchema.virtual('studentParentInvitations', {
    ref: db.names.parentStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'student'
});

userSchema.virtual('userFiles', {
    ref: db.names.userFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentFiles', {
    ref: db.names.parentFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('teacherFiles', {
    ref: db.names.teacherFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('studentFiles', {
    ref: db.names.studentFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('events', {
    ref: db.names.userEvent.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('studentClasses', {
    ref: db.names.classStudent.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('studentClassInvitations', {
    ref: db.names.classStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('userNotes', {
    ref: db.names.userNote.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentNotes', {
    ref: db.names.parentNote.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('studentNotes', {
    ref: db.names.studentNote.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('teacherNotes', {
    ref: db.names.teacherNote.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.pre('save', async function() {

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, +process.env.BCRYPT_ROUNDS || 8);
    }

});

userSchema.pre('remove', async function() {

    const user = this;

    try {

        const roles = await user.getUserRoles();

        if (user.avatar) {
            await storage.deleteBucketObjects(storage.config.bucketNames[db.names.user.modelName], [user.avatar.keyname]);
        }
        
        await applyDeletionRules(user, models.user.deletionUserRules);

        for (const role in models.user.deletionUserRulesByRole) {
            if (roles.includes(role)) {
                await applyDeletionRules(user, models.user.deletionUserRulesByRole[role]);
            }
        }

    } catch (e) {
        throw e;
    }

});

userSchema.statics.findByIdAndValidateRole = async function(_id, role, { notFoundErrorMessage, invalidRoleErrorMessage }) {

    const User = this;

    const user = await User.findOne({
        _id,
        enabled: true
    });

    if (!user) {
        throw new Error(notFoundErrorMessage);
    }

    const hasRole = await user.hasRole(role);

    if (!hasRole) {
        throw new Error(invalidRoleErrorMessage)
    }

    return user;

};

userSchema.methods.getUserRoles = async function() {

    const user = this;
    
    const pipeline = userRolePipelines.getRolesPipeline(user._id);
    const docs = await user.model(db.names.userRole.modelName).aggregate(pipeline);

    if (!docs.length) {
        return [];
    }

    const [uniqueUser] = docs;

    return uniqueUser.roles;

};

userSchema.methods.hasRole = async function(role) {

    const user = this;
    const roles = await user.getUserRoles();

    return roles.includes(role);

};

userSchema.methods.saveAvatar = async function(avatarDoc, buffer) {

    const userModel = this;

    if (userModel.avatar) {

        try {
            await storage.deleteBucketObjects(storage.config.bucketNames[db.names.user.modelName], [userModel.avatar.keyname]);
        } catch (e) {
            throw e;
        }

    }

    userModel.avatar = avatarDoc;

    try {
        await userModel.save();
    } catch (e) {
        throw e;
    }

    try {
        await storage.createMultipartObject(storage.config.bucketNames[db.names.user.modelName], {
            keyname: userModel.avatar.keyname,
            buffer,
            size: buffer.length,
            mimetype: userModel.avatar.mimetype
        });
    } catch (e) {

        userModel.avatar = undefined;
        await userModel.save();

        throw e;

    }

    return userModel;

};

module.exports = userSchema;
