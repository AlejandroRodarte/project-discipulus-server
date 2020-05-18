const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const shared = require('../../../../../src/shared');
const api = require('../../../../../src/api');
const util = require('../../../../../src/util');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userFileDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeFile()
};

let userFile = new db.models.UserFile(userFileDoc);
beforeEach(() => userFile = fixtures.functions.models.getNewModelInstance(db.models.UserFile, userFileDoc));

describe('[util/models/common/generate-save-file-and-doc-method] - general flow', () => {

    let validateFake;
    let userFileSaveStub;
    let createMultipartObjectStub;
    let userFileRemoveStub;

    it('Returned function call should throw error if validate callback (called with doc instance) rejects', async () => {

        validateFake = sinon.fake.rejects();

        const saveFileAndDoc = util.models.common.generateSaveFileAndDoc({
            modelName: shared.db.names.userFile.modelName,
            validate: validateFake
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);
        sinon.assert.calledOnceWithExactly(validateFake, userFile);

    });

    it('Returned function call should throw error if fileDoc.save fails', async () => {

        validateFake = sinon.fake.resolves();
        userFileSaveStub = sinon.stub(userFile, 'save').rejects();

        const saveFileAndDoc = util.models.common.generateSaveFileAndDoc({
            modelName: shared.db.names.parentFile.modelName,
            validate: validateFake
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);
        sinon.assert.calledOnce(userFileSaveStub);

    });

    it('Returned function should throw error and call fileDoc.remove if storage.createMultipartObject happends to fail (called with correct args)', async () => {

        validateFake = sinon.fake.resolves();
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').rejects();
        userFileRemoveStub = sinon.stub(userFile, 'remove').resolves();

        const saveFileAndDoc = util.models.common.generateSaveFileAndDoc({
            modelName: shared.db.names.userFile.modelName,
            validate: validateFake
        }).bind(userFile);

        const buffer = Buffer.alloc(10);

        await expect(saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.userFile.modelName], {
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
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();
        userFileRemoveStub = sinon.stub(userFile, 'remove').resolves();

        const saveFileAndDoc = util.models.common.generateSaveFileAndDoc({
            modelName: shared.db.names.parentFile.modelName,
            validate: validateFake
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.eql(userFile);

    });

    afterEach(() => {
        sinon.restore();
    });

});
