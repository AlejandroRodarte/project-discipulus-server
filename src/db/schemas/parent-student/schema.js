const { Schema, model } = require('mongoose');

const parentStudentDefinition = require('./definition');
const { parentStudent, user } = require('../../names');

const roleTypes = require('../../../util/roles');

const schemaOpts = {
    collection: parentStudent.collectionName
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentSchema.statics.add = async function(parentStudentDoc) {

    const ParentStudent = this;
    const User = model(user.modelName);

    const { parent: parentId, student: studentId } = parentStudentDoc;

    if (parentId.toString() === studentId.toString()) {
        throw new Error('Self-association is denied');
    }

    const parent = await User.findOne({
        _id: parentId,
        enabled: true
    });

    if (!parent) {
        throw new Error('The parent deleted/disabled his/her account');
    }

    const isParent = await parent.hasRole(roleTypes.ROLE_PARENT);

    if (!isParent) {
        throw new Error('The user is not a parent');
    }

    const parentStudent = new ParentStudent(parentStudentDoc);

    try {
        await parentStudent.save();
    } catch (e) {
        throw e;
    }

    return parentStudent;

};

module.exports = parentStudentSchema;
