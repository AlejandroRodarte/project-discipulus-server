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

const [userDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const teacherFileDoc = {
    user: userDoc._id,
    file: fixtures.functions.models.generateFakeFile()
};

let user = new db.models.User(userDoc);
let teacherFile = new db.models.TeacherFile(teacherFileDoc);

beforeEach(() => {
    user = fixtures.functions.models.getNewModelInstance(db.models.User, userDoc);
    teacherFile = fixtures.functions.models.getNewModelInstance(db.models.TeacherFile, teacherFileDoc);
});

describe('[db/models/teacher-file] - methods.saveFileAndDoc', () => {

    let userFindByIdAndValidateRoleStub;
    let teacherFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated functions should be called with the correct arguments, resolving the persisted teacher file', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(user);
        teacherFileSaveStub = sinon.stub(teacherFile, 'save').resolves(teacherFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(teacherFile.saveFileAndDoc(buffer)).to.eventually.eql(teacherFile);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, teacherFile.user, shared.roles.ROLE_TEACHER, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(teacherFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.teacherFile.modelName], {
            keyname: teacherFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: teacherFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
