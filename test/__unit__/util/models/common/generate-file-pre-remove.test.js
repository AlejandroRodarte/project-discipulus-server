const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { generateFilePreRemove } = require('../../../../../src/util/models/common');
const { generateFakeFile, getNewModelInstance } = require('../../../../__fixtures__/functions/models');

const { UserFile } = require('../../../../../src/db/models');

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

beforeEach(() => {
    userFile = getNewModelInstance(UserFile, userFileDoc);
});

describe('[util/models/common/generate-pre-remove-hook] - general flow', () => {

    let deleteBucketObjectsStub;

    it('Returned function should throw error if storageApi.deleteBucketObjects fails (called with correct args)', async () => {

        deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').rejects();

        const preRemoveHook = generateFilePreRemove({
            modelName: names.userFile.modelName
        }).bind(userFile)

        await expect(preRemoveHook()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteBucketObjectsStub, bucketNames[names.userFile.modelName], [userFile.file.keyname]);

    });

    it('Returned function should fullfill promise if object is deleted from bucket', async () => {

        deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').resolves();

        const preRemoveHook = generateFilePreRemove({
            modelName: names.userFile.modelName
        }).bind(userFile)

        await expect(preRemoveHook()).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
