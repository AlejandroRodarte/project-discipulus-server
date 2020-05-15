const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, StudentFile } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');

const names = require('../../../../src/db/names');
const roleTypes = require('../../../../src/util/roles');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const studentFileDoc = {
    user: userDoc._id,
    file: modelFunctions.generateFakeFile()
};

let user = new User(userDoc);
let studentFile = new StudentFile(studentFileDoc);

beforeEach(() => {
    user = modelFunctions.getNewModelInstance(User, userDoc);
    studentFile = modelFunctions.getNewModelInstance(StudentFile, studentFileDoc);
});

describe('[db/models/student-file] - methods.saveFileAndDoc', () => {

    let userFindByIdAndValidateRoleStub;
    let studentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated functions should be called with the correct arguments, resolving the persisted student file', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(user);
        studentFileSaveStub = sinon.stub(studentFile, 'save').resolves(studentFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(studentFile.saveFileAndDoc(buffer)).to.eventually.eql(studentFile);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, studentFile.user, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(studentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.studentFile.modelName], {
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
