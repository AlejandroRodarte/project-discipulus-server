
const { Schema } = require('mongoose');

const classStudentNoteDefinition = require('./definition');
const names = require('../../names');

const commonModelUtils = require('../../../util/models/common');
const { modelErrorMessages } = require('../../../util/errors');

const schemaOpts = {
    collection: names.classStudentNote.collectionName
};

const classStudentNoteDefinition = new Schema(classStudentNoteDefinition, schemaOpts);

classStudentNoteDefinition.index({ classStudent: 1, 'note.title': 1 }, { unique: true });

classStudentNoteDefinition.methods.checkAndSave = commonModelUtils.generateNoteCheckAndSave(commonModelUtils.generateParentDocExistsValidator({
    parentModelName: names.classStudent.modelName,
    ref: 'classStudent',
    notFoundErrorMessage: modelErrorMessages.classStudentNotFound
}));

module.exports = classStudentNoteDefinition;