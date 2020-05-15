const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { generateSaveFileAndDoc } = require('../../../../../src/util/models/common');
const { generateFakeFile, getNewModelInstance } = require('../../../../__fixtures__/functions/models');

const { User, UserFile } = require('../../../../../src/db/models');

const names = require('../../../../../src/db/names');

const storageApi = require('../../../../../src/api/storage');
const bucketNames = require('../../../../../src/api/storage/config/bucket-names');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userFileDoc = {
    user: new Types.ObjectId(),
    file: generateFakeFile()
};

let userFile = new UserFile(userFileDoc);
beforeEach(() => userFile = getNewModelInstance(UserFile, userFileDoc));

describe('[util/models/common/generate-save-file-and-doc-method] - general flow', () => {

    let validateFake;
    let userFileSaveStub;
    let createMultipartObjectStub;
    let userFileRemoveStub;

    it('Returned function call should throw error if validate callback (called with doc instance) rejects', async () => {

        validateFake = sinon.fake.rejects();

        const saveFileAndDoc = generateSaveFileAndDoc({
            modelName: names.userFile.modelName,
            validate: validateFake
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);
        sinon.assert.calledOnceWithExactly(validateFake, userFile);

    });

    it('Returned function call should throw error if fileDoc.save fails', async () => {

        validateFake = sinon.fake.resolves();
        userFileSaveStub = sinon.stub(userFile, 'save').rejects();

        const saveFileAndDoc = generateSaveFileAndDoc({
            modelName: names.parentFile.modelName,
            validate: validateFake
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);
        sinon.assert.calledOnce(userFileSaveStub);

    });

    it('Returned function should throw error and call fileDoc.remove if storageApi.createMultipartObject happends to fail (called with correct args)', async () => {

        validateFake = sinon.fake.resolves();
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').rejects();
        userFileRemoveStub = sinon.stub(userFile, 'remove').resolves();

        const saveFileAndDoc = generateSaveFileAndDoc({
            modelName: names.userFile.modelName,
            validate: validateFake
        }).bind(userFile);

        const buffer = Buffer.alloc(10);

        await expect(saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.userFile.modelName], {
            keyname: userFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: userFile.file.mimetype
        });

        sinon.assert.calledOnce(userFileRemoveStub);

    });

    it('Returned function should return fileDoc if all promises succeed', async () => {

        validateFake = sinon.fake.resolves();
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();
        userFileRemoveStub = sinon.stub(userFile, 'remove').resolves();

        const saveFileAndDoc = generateSaveFileAndDoc({
            modelName: names.parentFile.modelName,
            validate: validateFake
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.eql(userFile);

    });

    afterEach(() => {
        sinon.restore();
    });

});
