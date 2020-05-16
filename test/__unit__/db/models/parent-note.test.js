const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, ParentNote } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');
const roleTypes = require('../../../../src/util/roles');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [parentDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const parentNoteDoc = {
    user: new Types.ObjectId(),
    file: modelFunctions.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let parentNote = new ParentNote(parentNoteDoc);
let parent = new ParentNote(parentDoc);

beforeEach(() => {
    parentNote = modelFunctions.getNewModelInstance(ParentNote, parentNoteDoc);
    parent = modelFunctions.getNewModelInstance(User, parentDoc);
});

describe('[db/models/parent-note] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let parentNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').resolves(parent);
        parentNoteSaveStub = sinon.stub(parentNote, 'save').resolves(parentNote);

        await expect(parentNote.checkAndSave()).to.eventually.eql(parentNote);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentNote.user, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(parentNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
