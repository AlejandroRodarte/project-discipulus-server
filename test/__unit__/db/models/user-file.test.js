const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userFileDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeFile()
};

let userFile = new db.models.UserFile(userFileDoc);

beforeEach(() => userFile = fixtures.functions.models.getNewModelInstance(db.models.UserFile, userFileDoc));

describe('[db/models/user-file] - methods.saveFileAndDoc', () => {

    let userExistsStub;
    let userFileSaveStub;
    let createMultiPartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Should call all required methods with the correct arguments on correct flow', async () => {
        
        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        userFileSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultiPartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(userFile.saveFileAndDoc(buffer)).to.eventually.eql(userFile);

        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userFile.user,
            enabled: true
        });

        sinon.assert.calledOnce(userFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultiPartObjectStub, api.storage.config.bucketNames[shared.db.names.userFile.modelName], {
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
