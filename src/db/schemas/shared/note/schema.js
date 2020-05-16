const { Schema } = require('mongoose');

const sharedNoteDefinition = require('./definition');
const names = require('../../../names');

const markdownUtils = require('../../../../util/markdown');

const schemaOpts = {
    collection: names.sharedNote.collectionName
};

const sharedNoteSchema = new Schema(sharedNoteDefinition, schemaOpts);

sharedNoteSchema.virtual('html').get(function() {
    const note = this;
    return markdownUtils.parseMarkdownToHtml(note.markdown);
});

module.exports = sharedNoteSchema;