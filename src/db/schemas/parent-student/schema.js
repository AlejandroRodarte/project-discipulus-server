const { Schema, model } = require('mongoose');

const parentStudentDefinition = require('./definition');
const { parentStudent, user } = require('../../names');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: parentStudent.collectionName
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentSchema.methods.checkAndSave = async function() {

    const parentStudent = this;
    const User = model(user.modelName);

    const { parent, student } = parentStudent;

    if (parent.toHexString() === student.toHexString()) {
        throw new Error('Self-association is denied');
    }

    const parentUser = await User.findOne({
        _id: parent,
        enabled: true
    });

    if (!parentUser) {
        throw new Error('The parent deleted/disabled his/her account');
    }

    const isParent = await parentUser.hasRole(roleTypes.ROLE_PARENT);

    if (!isParent) {
        throw new Error('The user is not a parent');
    }

    try {
        await parentStudent.save();
    } catch (e) {
        throw e;
    }

    return parentStudent;

};

module.exports = parentStudentSchema;
