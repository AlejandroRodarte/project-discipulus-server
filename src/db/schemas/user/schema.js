const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const userDefinition = require('./definition');
const names = require('../../names');

const { getRolesPipeline } = require('../../aggregation/user-role');

const deletionUserRules = require('../../../util/models/user/deletion-user-rules');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const schemaOpts = {
    collection: names.user.collectionName
};

const userSchema = new Schema(userDefinition, schemaOpts);

userSchema.virtual('userroles', {
    ref: names.userRole.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentstudents', {
    ref: names.parentStudent.modelName,
    localField: '_id',
    foreignField: 'parent'
});

userSchema.virtual('studentparents', {
    ref: names.parentStudent.modelName,
    localField: '_id',
    foreignField: 'student'
});

userSchema.virtual('parentstudentinvitations', {
    ref: names.parentStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'parent'
});

userSchema.virtual('studentparentinvitations', {
    ref: names.parentStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'student'
});

userSchema.virtual('userfiles', {
    ref: names.userFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentfiles', {
    ref: names.parentFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('teacherfiles', {
    ref: names.teacherFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('studentfiles', {
    ref: names.studentFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('events', {
    ref: names.userEvent.modelName,
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

        await storageApi.deleteBucketObjects(bucketNames[names.user.modelName], [user.avatar.keyname]);

        await user.model(names.userRole.modelName).deleteMany({
            user: user._id
        });

        const userFiles = await user.model(names.userFile.modelName).find({
            user: user._id
        });

        const keynames = userFiles.map(userFile => userFile.file.keyname);

        await storageApi.deleteBucketObjects(bucketNames[names.userFile.modelName], keynames);

        await user.model(names.userFile.modelName).deleteMany({
            user: user._id
        });

        await user.model(names.userEvent.modelName).deleteMany({
            user: user._id
        });

        for (const role in deletionUserRules) {

            if (roles.includes(role)) {

                for (const rule of deletionUserRules[role]) {

                    if (rule.deleteFiles) {

                        const userFiles = await user.model(rule.modelName).find({
                            [rule.fieldName]: user._id
                        });

                        const keynames = userFiles.map(userFile => userFile.file.keyname);

                        await storageApi.deleteBucketObjects(bucketNames[rule.modelName], keynames);

                    }

                    await user.model(rule.modelName).deleteMany({
                        [rule.fieldName]: user._id
                    });

                }

            }

        }

    } catch (e) {
        throw e;
    }

});

userSchema.methods.getUserRoles = async function() {

    const user = this;
    
    const pipeline = getRolesPipeline(user._id);
    const docs = await user.model(names.userRole.modelName).aggregate(pipeline);

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
            await storageApi.deleteBucketObjects(bucketNames[names.user.modelName], [userModel.avatar.keyname]);
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
        await storageApi.createMultipartObject(bucketNames[names.user.modelName], {
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
