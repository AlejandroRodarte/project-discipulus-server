const { Schema } = require('mongoose');

const userNoteDefinition = require('./definition');
const { userNote, user } = require('../../names');

const commonModelUtils = require('../../../util/models/common');

const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: userNote.collectionName
};

const userNoteSchema = new Schema(userNoteDefinition, schemaOpts);

userNoteSchema.index({ user: 1, 'note.title': 1 }, { unique: true });

userNoteSchema.pre('remove', commonModelUtils.generateFilePreRemove({
    modelName: userNote.modelName
}));

userNoteSchema.methods.saveFileAndDoc = commonModelUtils.generateNoteCheckAndSave(async (noteDoc) => {

    const User = noteDoc.model(user.modelName);

    const { user: userId } = noteDoc;

    const userExists = await User.exists({ 
        _id: userId,
        enabled: true
    });

    if (!userExists) {
        throw new Error(modelErrorMessages.userNotFoundOrDisabled);
    }

});

module.exports = userNoteSchema;
