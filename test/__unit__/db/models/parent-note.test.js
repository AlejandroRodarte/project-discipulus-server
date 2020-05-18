const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [parentDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const parentNoteDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let parentNote = new db.models.ParentNote(parentNoteDoc);
let parent = new db.models.User(parentDoc);

beforeEach(() => {
    parentNote = fixtures.functions.models.getNewModelInstance(db.models.ParentNote, parentNoteDoc);
    parent = fixtures.functions.models.getNewModelInstance(db.models.User, parentDoc);
});

describe('[db/models/parent-note] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let parentNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(parent);
        parentNoteSaveStub = sinon.stub(parentNote, 'save').resolves(parentNote);

        await expect(parentNote.checkAndSave()).to.eventually.eql(parentNote);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentNote.user, util.roles.ROLE_PARENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(parentNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
