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

beforeEach(() => {
    userFile = fixtures.functions.models.getNewModelInstance(db.models.UserFile, userFileDoc);
});

describe('[util/models/common/generate-pre-remove-hook] - general flow', () => {

    let deleteBucketObjectsStub;

    it('Returned function should throw error if storage.deleteBucketObjects fails (called with correct args)', async () => {

        deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').rejects();

        const preRemoveHook = util.models.common.generateFilePreRemove({
            modelName: shared.db.names.userFile.modelName
        }).bind(userFile)

        await expect(preRemoveHook()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteBucketObjectsStub, api.storage.config.bucketNames[shared.db.names.userFile.modelName], [userFile.file.keyname]);

    });

    it('Returned function should fullfill promise if object is deleted from bucket', async () => {

        deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();

        const preRemoveHook = util.models.common.generateFilePreRemove({
            modelName: shared.db.names.userFile.modelName
        }).bind(userFile)

        await expect(preRemoveHook()).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
