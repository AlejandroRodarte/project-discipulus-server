const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const { UserRole, ParentStudent } = require('../../models');

const userDefinition = require('./definition');

const schemaOpts = {
    collection: 'users'
};

const userSchema = new Schema(userDefinition, schemaOpts);

userSchema.virtual('userroles', {
    ref: 'UserRole',
    localField: '_id',
    foreignField: 'owner'
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

    await UserRole.deleteMany({
        user: user._id
    });

    await ParentStudent.deleteMany({
        parent: user._id
    });

    await ParentStudent.deleteMany({
        student: user._id
    });

    next();

});

module.exports = userSchema;
