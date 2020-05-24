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

const parentFileDoc = {
    user: userDoc._id,
    file: fixtures.functions.models.generateFakeFile()
};

let user = new db.models.User(userDoc);
let parentFile = new db.models.ParentFile(parentFileDoc);

beforeEach(() => {
    user = fixtures.functions.models.getNewModelInstance(db.models.User, userDoc);
    parentFile = fixtures.functions.models.getNewModelInstance(db.models.ParentFile, parentFileDoc);
});

describe('[db/models/parent-file] - methods.saveFileAndDoc', () => {

    let userFindByIdAndValidateRoleStub;
    let parentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated functions should be called with the correct arguments, resolving the persisted parent file', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(user);
        parentFileSaveStub = sinon.stub(parentFile, 'save').resolves(parentFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.eql(parentFile);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, parentFile.user, shared.roles.ROLE_PARENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(parentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.parentFile.modelName], {
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
