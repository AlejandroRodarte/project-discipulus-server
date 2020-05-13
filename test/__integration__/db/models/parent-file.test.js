const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const ParentFile = require('../../../../src/db/models/parent-file');

const { uniqueParentFileContext } = require('../../../__fixtures__/models');
const { saveParentFileContext, removeParentFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-file] - uniqueParentFile context', () => {

    beforeEach(db.init(uniqueParentFileContext.persisted));

    describe('[db/models/parent-file] - user/file.originalname index', () => {

        const unpersistedParentFiles = uniqueParentFileContext.unpersisted[names.parentFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const parentFileDoc = new ParentFile(unpersistedParentFiles[0]);
            await expect(parentFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const parentFileDoc = new ParentFile(unpersistedParentFiles[1]);
            await expect(parentFileDoc.save()).to.eventually.be.eql(parentFileDoc);
        });

    });

    afterEach(db.teardown(uniqueParentFileContext.persisted));

});

describe('[db/models/parent-file] - removeParentFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeParentFileContext.persisted));

    describe('[db/models/parent-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedParentFiles = removeParentFileContext.persisted.db[names.parentFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(storageApi, 'deleteBucketObjects');

            const parentFileOneId = persistedParentFiles[0]._id;
            const parentFile = await ParentFile.findOne({ _id: parentFileOneId });

            await expect(parentFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, bucketNames[names.parentFile.modelName], [parentFile.file.keyname]);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.parentFile.modelName]);

            expect(bucketKeys).to.not.include(parentFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(dbStorage.teardown(removeParentFileContext.persisted));

});

describe('[db/models/parent-file] - saveParentFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(saveParentFileContext.persisted));

    const unpersistedDb = saveParentFileContext.unpersisted.db;

    describe('[db/models/parent-file] - methods.saveFileAndDoc', async () => {

        const unpersistedParentFiles = unpersistedDb[names.parentFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const parentFileDoc = unpersistedParentFiles[0];
            const parentFile = new ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const parentFileDoc = unpersistedParentFiles[1];
            const parentFile = new ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a user that is not a parent', async () => {

            const parentFileDoc = unpersistedParentFiles[2];
            const parentFile = new ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should throw error is parentFile.save fails validation/uniqueness', async () => {

            const parentFileDoc = unpersistedParentFiles[3];
            const parentFile = new ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a parent file that meets the requirements', async () => {

            const parentFileDoc = unpersistedParentFiles[4];
            const parentFile = new ParentFile(parentFileDoc);

            const buffer = getAssetBuffer(parentFile.file.originalname);

            await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.eql(parentFile);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.parentFile.modelName]);

            expect(bucketKeys).to.include(parentFile.file.keyname);

        });

    });

    this.afterEach(dbStorage.teardown(saveParentFileContext.persisted));

});
