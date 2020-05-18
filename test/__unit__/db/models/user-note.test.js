const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userNoteDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let userNote = new db.models.UserNote(userNoteDoc);

beforeEach(() => userNote = fixtures.functions.models.getNewModelInstance(db.models.UserNote, userNoteDoc));

describe('[db/models/user-note] - methods.checkAndSave', () => {

    let userExistsStub;
    let userNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        userNoteSaveStub = sinon.stub(userNote, 'save').resolves(userNote);

        await expect(userNote.checkAndSave()).to.eventually.eql(userNote);

        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userNote.user,
            enabled: true
        });

        sinon.assert.calledOnce(userNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
