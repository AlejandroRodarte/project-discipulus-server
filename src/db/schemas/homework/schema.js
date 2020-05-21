const { Schema } = require('mongoose');

const { db } = require('../../../shared');
const { models, errors } = require('../../../util');

const homeworkDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.homework.collectionName
};

const homeworkSchema = new Schema(homeworkDefinition, schemaOpts);

homeworkSchema.index({ class: 1, title: 1 }, { unique: true });

homeworkSchema.methods.saveAndAddStudents = models.common.generateSaveAndAddStudents({
    parent: {
        modelName: db.names.class.modelName,
        ref: 'class',
        notFoundErrorMessage: errors.modelErrorMessages.classNotFound,
        getIdsMethodName: 'getEnabledStudentIds'
    },
    child: {
        modelName: db.names.homeworkStudent.modelName,
        doc: {
            ref1: 'homework',
            ref2: 'classStudent'
        }
    }
});

module.exports = homeworkSchema;