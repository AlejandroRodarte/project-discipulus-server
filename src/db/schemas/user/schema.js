const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const userDefinition = require('./definition');
const { user, userRole, parentStudent, parentStudentInvitation, userFile, parentFile, studentFile, teacherFile } = require('../../names');

const { getRolesPipeline } = require('../../aggregation/user-role');

const deletionUserRules = require('../../../util/models/user/deletion-user-rules');

const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const schemaOpts = {
    collection: user.collectionName
};

const userSchema = new Schema(userDefinition, schemaOpts);

userSchema.virtual('userroles', {
    ref: userRole.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentstudents', {
    ref: parentStudent.modelName,
    localField: '_id',
    foreignField: 'parent'
});

userSchema.virtual('studentparents', {
    ref: parentStudent.modelName,
    localField: '_id',
    foreignField: 'student'
});

userSchema.virtual('parentstudentinvitations', {
    ref: parentStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'parent'
});

userSchema.virtual('studentparentinvitations', {
    ref: parentStudentInvitation.modelName,
    localField: '_id',
    foreignField: 'student'
});

userSchema.virtual('userfiles', {
    ref: userFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('parentfiles', {
    ref: parentFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('teacherfiles', {
    ref: teacherFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('studentfiles', {
    ref: studentFile.modelName,
    localField: '_id',
    foreignField: 'user'
});

userSchema.pre('save', async function(next) {

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, +process.env.BCRYPT_ROUNDS || 8);
    }

    next();

});

userSchema.pre('remove', async function(next) {

    const user = this;

    const roles = await this.getUserRoles();

    await user.model(userRole.modelName).deleteMany({
        user: user._id
    });

    await user.model(userFile.modelName).deleteMany({
        user: user._id
    });

    for (const role in deletionUserRules) {

        if (roles.includes(role)) {

            for (const rule of deletionUserRules[role]) {

                await user.model(rule.modelName).deleteMany({
                    [rule.fieldName]: user._id
                });

            }

        }

    }

    next();

});

userSchema.methods.getUserRoles = async function() {

    const user = this;
    
    const pipeline = getRolesPipeline(user._id);
    const docs = await user.model(userRole.modelName).aggregate(pipeline);

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

userSchema.methods.saveAvatar = async function(buffer) {

    const userModel = this;

    if (!userModel.file.keyname) {
        throw new Error('Persist the file document first before saving the image');
    }

    try {

        await storageApi.createMultipartObject(bucketNames[user.modelName], {
            keyname: userModel.file.keyname,
            buffer,
            mimetype: userModel.file.mimetype
        });

    } catch (e) {
        console.log(e);
    }

};

module.exports = userSchema;
