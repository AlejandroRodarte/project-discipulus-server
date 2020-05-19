const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const sessionDefinition = require('./definition');
const applyDeletionRules = require('../../apply-deletion-rules');

const schemaOpts = {
    collection: db.names.session.collectionName
};

const sessionSchema = new Schema(sessionDefinition, schemaOpts);

sessionSchema.index({ class: 1, title: 1 }, { unique: true });

sessionSchema.virtual('files', {
    ref: db.names.sessionFile.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.virtual('notes', {
    ref: db.names.sessionNote.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.virtual('students', {
    ref: db.names.sessionStudent.modelName,
    localField: '_id',
    foreignField: 'session'
});

sessionSchema.pre('remove', async function() {

    const session = this;

    try {
        await applyDeletionRules(session, models.session.deletionSessionRules);
    } catch (e) {
        throw e;
    }

});

sessionSchema.methods.saveAndAddStudents = async function() {

    const session = this;
    const Class = session.model(db.names.class.modelName);
    const SessionStudent = session.model(db.names.sessionStudent.modelName);

    const clazz = await Class.findOne({ _id: session.class });

    if (!clazz) {
        throw new Error(errors.modelErrorMessages.classNotFound);
    }

    try {
        await session.save();
    } catch (e) {
        throw e;
    }

    try {

        const enabledStudentIds = await clazz.getEnabledStudentIds();

        const sessionStudentDocs = enabledStudentIds.map(classStudent => ({
            session: session._id,
            classStudent
        }));

        await SessionStudent.insertMany(sessionStudentDocs);

    } catch (e) { }

    return session;

};

module.exports = sessionSchema;