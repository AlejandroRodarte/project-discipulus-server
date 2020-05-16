const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, StudentNote } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');
const roleTypes = require('../../../../src/util/roles');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [studentDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const studentNoteDoc = {
    user: new Types.ObjectId(),
    file: modelFunctions.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let studentNote = new StudentNote(studentNoteDoc);
let student = new StudentNote(studentDoc);

beforeEach(() => {
    studentNote = modelFunctions.getNewModelInstance(StudentNote, studentNoteDoc);
    student = modelFunctions.getNewModelInstance(User, studentDoc);
});

describe('[db/models/student-note] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let studentNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        studentNoteSaveStub = sinon.stub(studentNote, 'save').resolves(studentNote);

        await expect(studentNote.checkAndSave()).to.eventually.eql(studentNote);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, studentNote.user, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(studentNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
