const { Schema } = require('mongoose');

const { sharedUserNote } = require('../../../names');

const sharedUserNoteDefinition = require('./definition');

const schemaOpts = {
    collection: sharedUserNote.collectionName
};

const sharedUserNoteDefinition = new Schema(sharedUserNoteDefinition, schemaOpts);

module.exports = sharedUserNoteDefinition;