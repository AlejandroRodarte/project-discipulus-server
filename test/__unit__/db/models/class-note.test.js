const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { Class, ClassNote } = require('../../../../src/db/models');
const { classNoteDefinition } = require('../../../../src/db/schemas/class-note');
const modelFunctions = require('../../../__fixtures__/functions/models');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classNoteDoc = {
    class: new Types.ObjectId(),
    note: modelFunctions.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let classNote = new ClassNote(classNoteDoc);

beforeEach(() => classNote = modelFunctions.getNewModelInstance(ClassNote, classNoteDoc));

describe('[db/models/class-note] - Invalid class', () => {

    it('Should not validate if class id is undefined', () => {
        classNote.class = undefined;
        modelFunctions.testForInvalidModel(classNote, classNoteDefinition.class.required);
    });

});

describe('[db/models/class-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        classNote.note = undefined;
        modelFunctions.testForInvalidModel(classNote, classNoteDefinition.note.required);
    });

});

describe('[db/models/class-note] - Default published', () => {

    it('Should default published flag to false', () => {
        expect(classNote.published).to.equal(false);
    });

});

describe('[db/models/class-note] - Valid model', () => {

    it('Should validate correct model', () => {
        modelFunctions.testForValidModel(classNote);
    });

});

describe('[db/models/class-note] - methods.checkAndSave', () => {

    let classExistsStub;
    let classNoteSaveStub;

    it('Generated function should call methods with correct args and return class-note doc', async () => {

        classExistsStub = sinon.stub(Class, 'exists').resolves(true);
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
