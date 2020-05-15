const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, UserFile } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userFileDoc = {
    user: new Types.ObjectId(),
    file: modelFunctions.generateFakeFile()
};

let userFile = new UserFile(userFileDoc);

beforeEach(() => userFile = modelFunctions.getNewModelInstance(UserFile, userFileDoc));

describe('[db/models/user-file] - methods.saveFileAndDoc', () => {

    let userExistsStub;
    let userFileSaveStub;
    let createMultiPartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Should throw error if User.exists (called with correct args) resolves to false', async () => {
        
        userExistsStub = sinon.stub(User, 'exists').resolves(false);     
        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);
   
        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userFile.user,
            enabled: true
        });

    });

    it('Should call storageApi.createMultipartObject with right arguments and return fileDoc on success', async () => {
        
        userExistsStub = sinon.stub(User, 'exists').resolves(true);
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultiPartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.eql(userFile);

        sinon.assert.calledOnce(userFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultiPartObjectStub, bucketNames[names.userFile.modelName], {
            keyname: userFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: userFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
