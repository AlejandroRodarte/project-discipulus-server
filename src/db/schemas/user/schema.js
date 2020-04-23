const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

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

module.exports = userSchema;
