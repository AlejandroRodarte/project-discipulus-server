const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [sessionNoteDoc] = fixtures.functions.util.generateOneToMany('session', new Types.ObjectId(), [{ note: fixtures.functions.models.generateFakeNote() }]);
let sessionNote = new db.models.SessionNote(sessionNoteDoc);

beforeEach(() => sessionNote = fixtures.functions.models.getNewModelInstance(db.models.SessionNote, sessionNoteDoc));

describe('[db/models/session-note] - Invalid session _id', () => {

    it('Should not validate if session _id is undefined', () => {
        sessionNote.session = undefined;
        fixtures.functions.models.testForInvalidModel(sessionNote, db.schemas.definitions.sessionNoteDefinition.session.required);
    });

});

describe('[db/models/session-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        sessionNote.note = undefined;
        fixtures.functions.models.testForInvalidModel(sessionNote, db.schemas.definitions.sessionNoteDefinition.note.required);
    });

});

describe('[db/models/session-note] - Default published flag', () => {

    it('Should default published flag to false', () => {
        expect(sessionNote.published).to.equal(false);
    });

});

describe('[db/models/session-note] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(sessionNote);
    });

});

describe('[db/models/session-note] - methods.checkAndSave', () => {

    let sessionExistsStub;
    let sessionNoteSaveStub;

    it('Generated function should call methods with correct args and return session-note doc', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(true);
        sessionNoteSaveStub = sinon.stub(sessionNote, 'save').resolves(sessionNote);

        await expect(sessionNote.checkAndSave()).to.eventually.eql(sessionNote);

        sinon.assert.calledOnceWithExactly(sessionExistsStub, {
            _id: sessionNote.session
        });

        sinon.assert.calledOnce(sessionNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
