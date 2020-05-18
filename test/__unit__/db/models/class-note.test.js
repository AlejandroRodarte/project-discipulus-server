const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classNoteDoc = {
    class: new Types.ObjectId(),
    note: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let classNote = new db.models.ClassNote(classNoteDoc);

beforeEach(() => classNote = fixtures.functions.models.getNewModelInstance(db.models.ClassNote, classNoteDoc));

describe('[db/models/class-note] - Invalid class', () => {

    it('Should not validate if class id is undefined', () => {
        classNote.class = undefined;
        fixtures.functions.models.testForInvalidModel(classNote, db.schemas.definitions.classNoteDefinition.class.required);
    });

});

describe('[db/models/class-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        classNote.note = undefined;
        fixtures.functions.models.testForInvalidModel(classNote, db.schemas.definitions.classNoteDefinition.note.required);
    });

});

describe('[db/models/class-note] - Default published', () => {

    it('Should default published flag to false', () => {
        expect(classNote.published).to.equal(false);
    });

});

describe('[db/models/class-note] - Valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(classNote);
    });

});

describe('[db/models/class-note] - methods.checkAndSave', () => {

    let classExistsStub;
    let classNoteSaveStub;

    it('Generated function should call methods with correct args and return class-note doc', async () => {

        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(true);
        classNoteSaveStub = sinon.stub(classNote, 'save').resolves(classNote);

        await expect(classNote.checkAndSave()).to.eventually.eql(classNote);

        sinon.assert.calledOnceWithExactly(classExistsStub, {
            _id: classNote.class
        });

        sinon.assert.calledOnce(classNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
