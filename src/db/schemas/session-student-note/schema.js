
const { Schema } = require('mongoose');

const sessionStudentNoteDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.sessionStudentNote.collectionName
};

const sessionStudentNoteSchema = new Schema(sessionStudentNoteDefinition, schemaOpts);

sessionStudentNoteSchema.index({ sessionStudent: 1, 'note.title': 1 }, { unique: true });

sessionStudentNoteSchema.methods.checkAndSave = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.generateParentDocExistsValidator({
    parentModelName: names.sessionStudent.modelName,
    ref: 'sessionStudent',
    notFoundErrorMessage: modelErrorMessages.sessionStudentNotFouund
}));

module.exports = sessionStudentNoteSchema;