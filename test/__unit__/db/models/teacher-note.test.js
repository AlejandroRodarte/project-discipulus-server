const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [teacherDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const teacherNoteDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let teacherNote = new db.models.TeacherNote(teacherNoteDoc);
let teacher = new db.models.User(teacherDoc);

beforeEach(() => {
    teacherNote = fixtures.functions.models.getNewModelInstance(db.models.TeacherNote, teacherNoteDoc);
    teacher = fixtures.functions.models.getNewModelInstance(db.models.User, teacherDoc);
});

describe('[db/models/teacher-note] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let teacherNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(teacher);
        teacherNoteSaveStub = sinon.stub(teacherNote, 'save').resolves(teacherNote);

        await expect(teacherNote.checkAndSave()).to.eventually.eql(teacherNote);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, teacherNote.user, util.roles.ROLE_TEACHER, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(teacherNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
