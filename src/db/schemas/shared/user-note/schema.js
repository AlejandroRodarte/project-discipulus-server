const { Schema } = require('mongoose');

const { db } = require('../../../../shared');

const sharedUserNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedUserNote.collectionName
};

const sharedUserNoteSchema = new Schema(sharedUserNoteDefinition, schemaOpts);

module.exports = sharedUserNoteSchema;