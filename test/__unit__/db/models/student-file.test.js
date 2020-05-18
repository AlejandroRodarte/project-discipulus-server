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

const studentFileDoc = {
    user: userDoc._id,
    file: fixtures.functions.models.generateFakeFile()
};

let user = new db.models.User(userDoc);
let studentFile = new db.models.StudentFile(studentFileDoc);

beforeEach(() => {
    user = fixtures.functions.models.getNewModelInstance(db.models.User, userDoc);
    studentFile = fixtures.functions.models.getNewModelInstance(db.models.StudentFile, studentFileDoc);
});

describe('[db/models/student-file] - methods.saveFileAndDoc', () => {

    let userFindByIdAndValidateRoleStub;
    let studentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated functions should be called with the correct arguments, resolving the persisted student file', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(user);
        studentFileSaveStub = sinon.stub(studentFile, 'save').resolves(studentFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(studentFile.saveFileAndDoc(buffer)).to.eventually.eql(studentFile);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, studentFile.user, util.roles.ROLE_STUDENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(studentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.studentFile.modelName], {
            keyname: studentFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: studentFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
