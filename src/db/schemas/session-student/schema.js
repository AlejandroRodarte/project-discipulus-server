const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const sessionStudentDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.sessionStudent.collectionName
};

const sessionStudentSchema = new Schema(sessionStudentDefinition, schemaOpts);

sessionStudentSchema.index({ classStudent: 1, session: 1 }, { unique: true });

sessionStudentSchema.virtual('files', {
    ref: db.names.sessionStudentFile.modelName,
    localField: '_id',
    foreignField: 'sessionStudent'
});

sessionStudentSchema.virtual('notes', {
    ref: db.names.sessionStudentNote.modelName,
    localField: '_id',
    foreignField: 'sessionStudent'
});

sessionStudentSchema.pre('remove', async function() {

    const sessionStudent = this;

    try {
        applyDeletionRules(sessionStudent, models.sessionStudent.deletionSessionStudentRules);
    } catch {
        throw e;
    }

});

sessionStudentSchema.methods.checkAndSave = async function() {

    const sessionStudent = this;

    const ClassStudent = sessionStudent.model(db.names.classStudent.modelName);
    const Session = sessionStudent.model(db.names.session.modelName);

    const sessionExists = await Session.exists({
        _id: sessionStudent.session
    });

    if (!sessionExists) {
        throw new Error(errors.modelErrorMessages.sessionNotFound);
    }

    const classStudent = await ClassStudent.findOne({
        _id: sessionStudent.classStudent
    });

    if (!classStudent) {
        throw new Error(errors.modelErrorMessages.classStudentNotFound);
    }

    // const isStudentEnabled = classStudent.isStudentEnabled();

    // if (!isStudentEnabled) {
    //     throw new Error(errors.modelErrorMessages.userDisabled);
    // }

    try {
        await sessionStudent.save();
    } catch (e) {
        throw e;
    }

    return sessionStudent;

};

module.exports = sessionStudentSchema;