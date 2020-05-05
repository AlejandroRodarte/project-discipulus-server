const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserFile = require('../../../../src/db/models/user-file');

const { uniqueUserFileContext } = require('../../../__fixtures__/models');
const { removeUserFileContext, saveUserFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-file] - uniqueUserFile context', () => {

    beforeEach(db.init(uniqueUserFileContext.persisted));

    describe('[db/models/user-file] - user/file.originalname index', () => {

        const unpersistedUsersFiles = uniqueUserFileContext.unpersisted[names.userFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const userFileDoc = new UserFile(unpersistedUsersFiles[0]);
            await expect(userFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const userFileDoc = new UserFile(unpersistedUsersFiles[1]);
            await expect(userFileDoc.save()).to.eventually.be.eql(userFileDoc);
        });

    });

    afterEach(db.teardown(uniqueUserFileContext.persisted));

});

describe('[db/models/user-file] - removeUserFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeUserFileContext.persisted));

    describe('[db/models/user-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedUserFiles = removeUserFileContext.persisted.db[names.userFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(storageApi, 'deleteBucketObjects');

            const userFileOneId = persistedUserFiles[0]._id;
            const userFile = await UserFile.findOne({ _id: userFileOneId });

            await expect(userFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, bucketNames[names.userFile.modelName], [userFile.file.keyname]);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.userFile.modelName]);

            expect(bucketKeys).to.not.include(userFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(dbStorage.teardown(removeUserFileContext.persisted));

});

describe('[db/models/user-file] - saveUserFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(saveUserFileContext.persisted));

    const unpersistedDb = saveUserFileContext.unpersisted.db;

    describe('[db/models/user-file] - methods.saveFileAndDoc', async () => {

        const unpersistedUserFiles = unpersistedDb[names.userFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const unknownUserFileDoc = unpersistedUserFiles[0];
            const unknownUserFile = new UserFile(unknownUserFileDoc);

            await expect(unknownUserFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const disabledUserFileDoc = unpersistedUserFiles[1];
            const disabledUserFile = new UserFile(disabledUserFileDoc);

            await expect(disabledUserFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error is userFile.save fails validation/uniqueness', async () => {

            const nonUniqueUserFileDoc = unpersistedUserFiles[2];
            const nonUniqueUserFile = new UserFile(nonUniqueUserFileDoc);

            await expect(nonUniqueUserFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a user file that meets the requirements', async () => {

            const userFileDoc = unpersistedUserFiles[3];
            const userFile = new UserFile(userFileDoc);

            const buffer = getAssetBuffer(userFile.file.originalname);

            await expect(userFile.saveFileAndDoc(buffer)).to.eventually.eql(userFile);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.userFile.modelName]);

            expect(bucketKeys).to.include(userFile.file.keyname);

        });

    });

    this.afterEach(dbStorage.teardown(saveUserFileContext.persisted));

});
