const { Schema } = require('mongoose');

const classDefinition = require('./definition');
const { class: clazz } = require('../../names');

const schemaOpts = {
    collection: clazz.collectionName
};

const classSchema = new Schema(classDefinition, schemaOpts);

module.exports = classSchema;
