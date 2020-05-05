const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, UserFile } = require('../../../../src/db/models');
const modelFunctions = require('../../../__fixtures__/functions/models');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const sampleFiles = require('../../../__fixtures__/shared/sample-files');

const bucketNames = require('../../../../src/api/storage/config/bucket-names');
const generateFakeUsers = require('../../../__fixtures__/functions/models/generate-fake-users');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = generateFakeUsers(1, { fakeToken: true });

const userFileDoc = {
    user: userDoc._id,
    file: sampleFiles.pdfFile
};

const buffer = Buffer.alloc(10);

let userFile = new UserFile(userFileDoc);
let user = new User(userDoc);

beforeEach(() => {
    userFile = modelFunctions.getNewModelInstance(UserFile, userFileDoc);
    user = modelFunctions.getNewModelInstance(User, userDoc);
});

describe('[db/models/user-file] - methods.saveFileAndDoc', () => {

    let userFindOneStub;
    let userFileSaveStub;
    let createMultipartObjectStub;
    let userFileRemoveStub;

    it('Should call User.findOne with correct arguments and throw error if resolves null', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: userFile.user,
            enabled: true
        });

    });

    it('Should throw error is userFile.save rejects and be called once', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userFileSaveStub = sinon.stub(userFile, 'save').rejects();

        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(userFileSaveStub);

    });

    it('Should remove userFile doc and throw error if storageApi.createMultipartObject (called with correct args) fails', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').rejects();
        userFileRemoveStub = sinon.stub(userFile, 'remove').resolves();

        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.userFile.modelName], {
            keyname: userFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: userFile.file.mimetype
        });

        sinon.assert.calledOnce(userFileRemoveStub);

    });

    it('Should return userFile model instance if all async tasks succeed', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.be.eql(userFile);

    });

    afterEach(() => {
        sinon.restore();
    });

});
