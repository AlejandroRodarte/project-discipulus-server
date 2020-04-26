const { Schema } = require('mongoose');

const parentStudentDefinition = require('./definition');
const { parentStudent, user } = require('../../names');

const roles = require('../../../util/roles');

const schemaOpts = {
    collection: parentStudent.collectionName
};

const parentStudentSchema = new Schema(parentStudentDefinition, schemaOpts);

parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

parentStudentSchema.pre('save', async function(next) {

    const parentStudent = this;

    const parentUser = await parentStudent.model(user.modelName).findOne({ _id: parentStudent.parent });
    const studentUser = await parentStudent.model(user.modelName).findOne({ _id: parentStudent.student });

    const parentRoles = await parentUser.getUserRoles();
    const studentRoles = await studentUser.getUserRoles();

    if (parentRoles.includes(roles.ROLE_PARENT) && studentRoles.includes(roles.ROLE_STUDENT)) {
        next();
    } else {
        next(new Error('Role mismatch'));
    }

});

module.exports = parentStudentSchema;
