const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [studentDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const studentNoteDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let studentNote = new db.models.StudentNote(studentNoteDoc);
let student = new db.models.User(studentDoc);

beforeEach(() => {
    studentNote = fixtures.functions.models.getNewModelInstance(db.models.StudentNote, studentNoteDoc);
    student = fixtures.functions.models.getNewModelInstance(db.models.User, studentDoc);
});

describe('[db/models/student-note] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let studentNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        studentNoteSaveStub = sinon.stub(studentNote, 'save').resolves(studentNote);

        await expect(studentNote.checkAndSave()).to.eventually.eql(studentNote);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, studentNote.user, util.roles.ROLE_STUDENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(studentNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
