const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, ParentFile } = require('../../../../src/db/models');
const modelFunctions = require('../../../__fixtures__/functions/models');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const sampleFiles = require('../../../__fixtures__/shared/sample-files');

const bucketNames = require('../../../../src/api/storage/config/bucket-names');
const generateFakeUsers = require('../../../__fixtures__/functions/models/generate-fake-users');

const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = generateFakeUsers(1, { fakeToken: true });

const parentFileDoc = {
    user: userDoc._id,
    file: sampleFiles.pdfFile
};

const buffer = Buffer.alloc(10);

let parentFile = new ParentFile(parentFileDoc);
let user = new User(userDoc);

beforeEach(() => {
    parentFile = modelFunctions.getNewModelInstance(ParentFile, parentFileDoc);
    user = modelFunctions.getNewModelInstance(User, userDoc);
});

describe('[db/models/parent-file] - methods.saveFileAndDoc', () => {

    let userFindOneStub;
    let userHasRoleStub;
    let parentFileSaveStub;
    let createMultipartObjectStub;
    let parentFileRemoveStub;

    it('Should call User.findOne with correct arguments and throw error if resolves null', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: parentFile.user,
            enabled: true
        });

    });

    it('Should call user.hasRole with correct arguments and throw error if it returns false', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(false);

        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userHasRoleStub, roleTypes.ROLE_PARENT);

    });

    it('Should throw error is parentFile.save rejects and be called once', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        parentFileSaveStub = sinon.stub(parentFile, 'save').rejects();

        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentFileSaveStub);

    });

    it('Should remove parentFile doc and throw error if storageApi.createMultipartObject (called with correct args) fails', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        parentFileSaveStub = sinon.stub(parentFile, 'save').resolves(parentFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').rejects();
        parentFileRemoveStub = sinon.stub(parentFile, 'remove').resolves();

        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.parentFile.modelName], {
            keyname: parentFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: parentFile.file.mimetype
        });

        sinon.assert.calledOnce(parentFileRemoveStub);

    });

    it('Should return parentFile model instance if all async tasks succeed', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        parentFileSaveStub = sinon.stub(parentFile, 'save').resolves(parentFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.be.eql(parentFile);

    });

    afterEach(() => {
        sinon.restore();
    });

});
