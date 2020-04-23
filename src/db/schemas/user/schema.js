const { Schema } = require('mongoose');

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

module.exports = userSchema;
