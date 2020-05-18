const expect = require('chai').expect;

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const noteDoc = fixtures.functions.models.generateFakeNote({
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

let note = new db.models.shared.Note(noteDoc);

beforeEach(() => note = fixtures.functions.models.getNewModelInstance(db.models.shared.Note, noteDoc));

describe('[db/models/shared/note] - Invalid title', () => {

    const [noteTitleMinLength] = db.schemas.shared.definitions.sharedNoteDefinition.title.minlength;
    const [noteTitleMaxLength] = db.schemas.shared.definitions.sharedNoteDefinition.title.maxlength;

    it('Should not validate if title is undefined', () => {
        note.title = undefined;
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.title.required);
    });

    it('Should not validate if note title has bad words', () => {
        note.title = 'Got to fuck';
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.title.validate);
    });

    it(`Should not validate if note title is shorter than ${ noteTitleMinLength } characters`, () => {
        note.title = 'a';
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.title.minlength);
    });

    it(`Should not validate if note title is longer than ${ noteTitleMaxLength } characters`, () => {
        note.title = fixtures.util.lorem.generateWords(30);
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.title.maxlength);
    });

});

describe('[db/models/shared/note] - Valid title', () => {

    it('Should trim redundant spaces on correct note title', () => {

        note.title = '  Something   to   do    ';
        fixtures.functions.models.testForValidModel(note);

        expect(note.title).to.equal('Something to do');

    });

});

describe('[db/models/shared/note] - Undefined description', () => {

    it('Should validate note if description is undefined', () => {
        note.description = undefined;
        fixtures.functions.models.testForValidModel(note);
    });

});

describe('[db/models/shared/note] - Invalid description', () => {

    const [noteDescriptionMaxLength] = db.schemas.shared.definitions.sharedNoteDefinition.description.maxlength;

    it('Should not validate if note description has bad words', () => {
        note.description = 'So we need to cum';
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.description.validate);
    });

    it(`Should not validate if note description is longer than ${ noteDescriptionMaxLength } characters`, () => {
        note.description = fixtures.util.lorem.generateSentences(50);
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.description.maxlength);
    });

});

describe('[db/models/shared/note] - Valid description', () => {

    it('Should trim redundant spaces on correct note description', () => {

        note.description = '     Move    around bro    ';
        fixtures.functions.models.testForValidModel(note);

        expect(note.description).to.equal('Move around bro');

    });

});

describe('[db/models/shared/note] - Invalid markdown', function() {

    this.timeout(5000);

    const [noteMarkdownMinLength] = db.schemas.shared.definitions.sharedNoteDefinition.markdown.minlength;
    const [noteMarkdownMaxLength] = db.schemas.shared.definitions.sharedNoteDefinition.markdown.maxlength;

    it('Should not validate if markdown is undefined', () => {
        note.markdown = undefined;
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.markdown.required);
    });

    it('Should not validate if note markdown has bad words', () => {

        note.markdown = `
            ---
            # Title
            > Some fucked up shit
            ## Subtitle
            ---
        `;

        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.markdown.validate);

    });

    it(`Should not validate if note markdown is shorter than ${ noteMarkdownMinLength } characters`, () => {
        note.markdown = '# Bo';
        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.markdown.minlength);
    });

    it(`Should not validate if note markdown is longer than ${ noteMarkdownMaxLength } characters`, () => {

        note.markdown = `
            ---

            # Title

            - ${ fixtures.util.lorem.generateSentences(200) }

            ## Subtitle

            - ${ fixtures.util.lorem.generateSentences(300) }

        `;

        fixtures.functions.models.testForInvalidModel(note, db.schemas.shared.definitions.sharedNoteDefinition.markdown.maxlength);

    });

});

describe('[db/models/shared/note] - Valid markdown', () => {

    it('Should trim on correct note markdown', () => {

        note.markdown = '  # What the fock  ';
        fixtures.functions.models.testForValidModel(note);

        expect(note.markdown).to.equal('# What the fock');

    });

});

describe('[db/models/shared/note] - Virtual html', () => {

    it('Should parse markdown to html on virtual getter call', () => {
        expect(note.html.startsWith('<hr>')).to.equal(true);
    });

});
