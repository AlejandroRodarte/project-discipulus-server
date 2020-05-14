const { Schema } = require('mongoose');

const classUnknownStudentInvitationDefinition = require('./definition');
const names = require('../../names');

const schemaOpts = {
    collection: names.classUnknownStudentInvitation.collectionName
};

const classUnknownStudentInvitationSchema = new Schema(classUnknownStudentInvitationDefinition, schemaOpts);

classUnknownStudentInvitationSchema.index({ class: 1, email: 1 }, { unique: true });

classUnknownStudentInvitationSchema.methods.checkAndSave = async function() {

    const classUnknownStudentInvitation = this;

    const User = classUnknownStudentInvitation.model(names.user.modelName);
    const ClassStudentInvitation = classUnknownStudentInvitation.model(names.classStudentInvitation.modelName);

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
        await classUnknownStudentInvitation.save();
    } catch (e) {
        throw e;
    }

    return classUnknownStudentInvitation;

};

module.exports = classUnknownStudentInvitationSchema;