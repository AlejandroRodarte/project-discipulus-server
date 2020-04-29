const { Schema } = require('mongoose');

const teacherFileDefinition = require('./definition');
const { teacherfile } = require('../../names');

const schemaOpts = {
    collection: teacherfile.collectionName
};

const teacherFileSchema = new Schema(teacherFileDefinition, schemaOpts);

module.exports = teacherFileSchema;
