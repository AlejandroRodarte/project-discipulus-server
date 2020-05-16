const expect = require('chai').expect;

const lorem = require('../../../../__fixtures__/util/lorem');

const { Note } = require('../../../../../src/db/models/shared');
const { sharedNoteDefinition } = require('../../../../../src/db/schemas/shared/note');
const modelFunctions = require('../../../../__fixtures__/functions/models');

const noteDoc = modelFunctions.generateFakeNote({
    titleWords: 5,
    descriptionWords: 10,
    markdown: `
        ---
        # Title

        > Some cool stuff

        ## Subtitle

        - Bullets

        ---
    `
});

let note = new Note(noteDoc);

beforeEach(() => note = modelFunctions.getNewModelInstance(Note, noteDoc));

describe('[db/models/shared/note] - Invalid title', () => {

    const [noteTitleMinLength] = sharedNoteDefinition.title.minlength;
    const [noteTitleMaxLength] = sharedNoteDefinition.title.maxlength;

    it('Should not validate if title is undefined', () => {
        note.title = undefined;
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.title.required);
    });

    it('Should not validate if note title has bad words', () => {
        note.title = 'Got to fuck';
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.title.validate);
    });

    it(`Should not validate if note title is shorter than ${ noteTitleMinLength } characters`, () => {
        note.title = 'a';
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.title.minlength);
    });

    it(`Should not validate if note title is longer than ${ noteTitleMaxLength } characters`, () => {
        note.title = lorem.generateWords(30);
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.title.maxlength);
    });

});

describe('[db/models/shared/note] - Valid title', () => {

    it('Should trim redundant spaces on correct note title', () => {

        note.title = '  Something   to   do    ';
        modelFunctions.testForValidModel(note);

        expect(note.title).to.equal('Something to do');

    });

});

describe('[db/models/shared/note] - Undefined description', () => {

    it('Should validate note if description is undefined', () => {
        note.description = undefined;
        modelFunctions.testForValidModel(note);
    });

});

describe('[db/models/shared/note] - Invalid description', () => {

    const [noteDescriptionMaxLength] = sharedNoteDefinition.description.maxlength;

    it('Should not validate if note description has bad words', () => {
        note.description = 'So we need to cum';
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.description.validate);
    });

    it(`Should not validate if note description is longer than ${ noteDescriptionMaxLength } characters`, () => {
        note.description = lorem.generateSentences(50);
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.description.maxlength);
    });

});

describe('[db/models/shared/note] - Valid description', () => {

    it('Should trim redundant spaces on correct note description', () => {

        note.description = '     Move    around bro    ';
        modelFunctions.testForValidModel(note);

        expect(note.description).to.equal('Move around bro');

    });

});

describe('[db/models/shared/note] - Invalid markdown', function() {

    this.timeout(5000);

    const [noteMarkdownMinLength] = sharedNoteDefinition.markdown.minlength;
    const [noteMarkdownMaxLength] = sharedNoteDefinition.markdown.maxlength;

    it('Should not validate if markdown is undefined', () => {
        note.markdown = undefined;
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.markdown.required);
    });

    it('Should not validate if note markdown has bad words', () => {

        note.markdown = `
            ---
            # Title
            > Some fucked up shit
            ## Subtitle
            ---
        `;

        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.markdown.validate);

    });

    it(`Should not validate if note markdown is shorter than ${ noteMarkdownMinLength } characters`, () => {
        note.markdown = '# Bo';
        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.markdown.minlength);
    });

    it(`Should not validate if note markdown is longer than ${ noteMarkdownMaxLength } characters`, () => {

        note.markdown = `
            ---

            # Title

            - ${ lorem.generateSentences(200) }

            ## Subtitle

            - ${ lorem.generateSentences(300) }

        `;

        modelFunctions.testForInvalidModel(note, sharedNoteDefinition.markdown.maxlength);

    });

});

describe('[db/models/shared/note] - Valid markdown', () => {

    it('Should trim on correct note markdown', () => {

        note.markdown = '  # What the fock  ';
        modelFunctions.testForValidModel(note);

        expect(note.markdown).to.equal('# What the fock');

    });

});

describe('[db/models/shared/note] - Virtual html', () => {

    it('Should parse markdown to html on virtual getter call', () => {
        expect(note.html.startsWith('<hr>')).to.equal(true);
    });

});
