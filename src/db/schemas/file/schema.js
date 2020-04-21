const { Schema } = require('mongoose');

const fileDefinition = require('./definition');

const fileSchema = new Schema(fileDefinition);

module.exports = fileSchema;
