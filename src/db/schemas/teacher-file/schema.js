const { Schema } = require('mongoose');

const teacherFileDefinition = require('./definition');
const { teacherFile } = require('../../names');

const schemaOpts = {
    collection: teacherFile.collectionName
};

const teacherFileSchema = new Schema(teacherFileDefinition, schemaOpts);

module.exports = teacherFileSchema;
