const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, TeacherNote } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');
const roleTypes = require('../../../../src/util/roles');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [teacherDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const teacherNoteDoc = {
    user: new Types.ObjectId(),
    file: modelFunctions.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let teacherNote = new TeacherNote(teacherNoteDoc);
let teacher = new User(teacherDoc);

beforeEach(() => {
    teacherNote = modelFunctions.getNewModelInstance(TeacherNote, teacherNoteDoc);
    teacher = modelFunctions.getNewModelInstance(User, teacherDoc);
});

describe('[db/models/teacher-note] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let teacherNoteSaveStub;

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').resolves(teacher);
        teacherNoteSaveStub = sinon.stub(teacherNote, 'save').resolves(teacherNote);

        await expect(teacherNote.checkAndSave()).to.eventually.eql(teacherNote);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, teacherNote.user, roleTypes.ROLE_TEACHER, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(teacherNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
