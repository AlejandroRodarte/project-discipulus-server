const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { errors } = require('../../../util');

const classUnknownStudentInvitationDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.classUnknownStudentInvitation.collectionName
};

const classUnknownStudentInvitationSchema = new Schema(classUnknownStudentInvitationDefinition, schemaOpts);

classUnknownStudentInvitationSchema.index({ class: 1, email: 1 }, { unique: true });

classUnknownStudentInvitationSchema.methods.checkAndSave = async function() {

    const classUnknownStudentInvitation = this;

    const User = classUnknownStudentInvitation.model(db.names.user.modelName);
    const ClassStudentInvitation = classUnknownStudentInvitation.model(db.names.classStudentInvitation.modelName);
    const Class = classUnknownStudentInvitation.model(db.names.class.modelName);

    const student = await User.findOne({
        email: classUnknownStudentInvitation.email
    });

    if (student) {

        const classStudentInvitation = new ClassStudentInvitation({
            class: classUnknownStudentInvitation.class,
            user: student._id
        });

        try {
            await classStudentInvitation.checkAndSave();
        } catch (e) {
            throw e;
        }

        return classStudentInvitation;

    }

    try {

        const classExists = await Class.exists({ _id: classUnknownStudentInvitation.class });

        if (!classExists) {
            throw new Error(errors.modelErrorMessages.classNotFound);
        }

        await classUnknownStudentInvitation.save();

    } catch (e) {
        throw e;
    }

    return classUnknownStudentInvitation;

};

module.exports = classUnknownStudentInvitationSchema;