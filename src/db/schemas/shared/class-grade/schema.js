const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedClassGradeDefinitions = require('./definition');

const schemaOpts = {
    collection: db.names.sharedClassGrade.collectionName
};

const sharedClassGradeSchema = new Schema(sharedClassGradeDefinitions, schemaOpts);

sharedClassGradeSchema.virtual('finalGrade').get(function() {
    const classGrade = this;
    return classGrade.homeworks + classGrade.projects + classGrade.exams;
});

module.exports = sharedClassGradeSchema;
