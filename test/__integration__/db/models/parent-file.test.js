const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-file] - uniqueParentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueParentFileContext.persisted));

    describe('[db/models/parent-file] - user/file.originalname index', () => {

        const unpersistedParentFiles = fixtures.models.uniqueParentFileContext.unpersisted[shared.db.names.parentFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const parentFileDoc = new db.models.ParentFile(unpersistedParentFiles[0]);
            await expect(parentFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const parentFileDoc = new db.models.ParentFile(unpersistedParentFiles[1]);
            await expect(parentFileDoc.save()).to.eventually.be.eql(parentFileDoc);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueParentFileContext.persisted));

});

describe('[db/models/parent-file] - removeParentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeParentFileContext.persisted));

    describe('[db/models/parent-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedParentFiles = fixtures.modelsStorage.removeParentFileContext.persisted.db[shared.db.names.parentFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(api.storage, 'deleteBucketObjects');

            const parentFileOneId = persistedParentFiles[0]._id;
            const parentFile = await db.models.ParentFile.findOne({ _id: parentFileOneId });

            await expect(parentFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, api.storage.config.bucketNames[shared.db.names.parentFile.modelName], [parentFile.file.keyname]);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.parentFile.modelName]);

            expect(bucketKeys).to.not.include(parentFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeParentFileContext.persisted));

});

describe('[db/models/parent-file] - saveParentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveParentFileContext.persisted));

    const unpersistedDb = fixtures.modelsStorage.saveParentFileContext.unpersisted.db;

    describe('[db/models/parent-file] - methods.saveFileAndDoc', async () => {

        const unpersistedParentFiles = unpersistedDb[shared.db.names.parentFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const parentFileDoc = unpersistedParentFiles[0];
            const parentFile = new db.models.ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const parentFileDoc = unpersistedParentFiles[1];
            const parentFile = new db.models.ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a user that is not a parent', async () => {

            const parentFileDoc = unpersistedParentFiles[2];
            const parentFile = new db.models.ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should throw error is parentFile.save fails validation/uniqueness', async () => {

            const parentFileDoc = unpersistedParentFiles[3];
            const parentFile = new db.models.ParentFile(parentFileDoc);

            await expect(parentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a parent file that meets the requirements', async () => {

            const parentFileDoc = unpersistedParentFiles[4];
            const parentFile = new db.models.ParentFile(parentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(parentFile.file.originalname);

            await expect(parentFile.saveFileAndDoc(buffer)).to.eventually.eql(parentFile);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.parentFile.modelName]);

            expect(bucketKeys).to.include(parentFile.file.keyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveParentFileContext.persisted));

});
