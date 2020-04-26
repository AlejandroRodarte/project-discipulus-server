const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const userDefinition = require('./definition');
const { user, userRole, parentStudent } = require('../../names');

const schemaOpts = {
    collection: user.collectionName
};

const userSchema = new Schema(userDefinition, schemaOpts);

userSchema.virtual('userroles', {
    ref: userRole.modelName,
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

    await user.model(userRole.modelName).deleteMany({
        user: user._id
    });

    await user.model(parentStudent.modelName).deleteMany({
        parent: user._id
    });

    await user.model(parentStudent.modelName).deleteMany({
        student: user._id
    });

    next();

});

module.exports = userSchema;
