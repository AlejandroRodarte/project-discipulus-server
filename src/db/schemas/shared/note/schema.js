const { Schema } = require('mongoose');

const { db } = require('../../../../shared');
const { markdown } = require('../../../../util');

const sharedNoteDefinition = require('./definition');

const schemaOpts = {
    collection: db.names.sharedNote.collectionName
};

const sharedNoteSchema = new Schema(sharedNoteDefinition, schemaOpts);

sharedNoteSchema.virtual('html').get(function() {
    const note = this;
    return markdown.parseMarkdownToHtml(note.markdown);
});

module.exports = sharedNoteSchema;