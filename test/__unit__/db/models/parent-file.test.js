const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, ParentFile } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');

const names = require('../../../../src/db/names');
const roleTypes = require('../../../../src/util/roles');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const parentFileDoc = {
    user: userDoc._id,
    file: modelFunctions.generateFakeFile()
};

let user = new User(userDoc);
let parentFile = new ParentFile(parentFileDoc);

beforeEach(() => {
    user = modelFunctions.getNewModelInstance(User, userDoc);
    parentFile = modelFunctions.getNewModelInstance(ParentFile, parentFileDoc);
});

describe('[db/models/parent-file] - methods.saveFileAndDoc', () => {

    let userFindByIdAndValidateRoleStub;
    let parentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated functions should be called with the correct arguments, resolving the persisted parent file', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(user);
        parentFileSaveStub = sinon.stub(parentFile, 'save').resolves(parentFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.eql(parentFile);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, parentFile.user, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(parentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.parentFile.modelName], {
            keyname: parentFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: parentFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
