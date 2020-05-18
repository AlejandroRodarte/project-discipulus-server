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

describe('[db/models/user-file] - uniqueUserFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueUserFileContext.persisted));

    describe('[db/models/user-file] - user/file.originalname index', () => {

        const unpersistedUsersFiles = fixtures.models.uniqueUserFileContext.unpersisted[shared.db.names.userFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const userFile = new db.models.UserFile(unpersistedUsersFiles[0]);
            await expect(userFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const userFile = new db.models.UserFile(unpersistedUsersFiles[1]);
            await expect(userFile.save()).to.eventually.be.eql(userFile);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueUserFileContext.persisted));

});

describe('[db/models/user-file] - removeUserFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeUserFileContext.persisted));

    describe('[db/models/user-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedUserFiles = fixtures.modelsStorage.removeUserFileContext.persisted.db[shared.db.names.userFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(api.storage, 'deleteBucketObjects');

            const userFileOneId = persistedUserFiles[0]._id;
            const userFile = await db.models.UserFile.findOne({ _id: userFileOneId });

            await expect(userFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, api.storage.config.bucketNames[shared.db.names.userFile.modelName], [userFile.file.keyname]);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.userFile.modelName]);

            expect(bucketKeys).to.not.include(userFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeUserFileContext.persisted));

});

describe('[db/models/user-file] - saveUserFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveUserFileContext.persisted));

    const unpersistedUserFiles = fixtures.modelsStorage.saveUserFileContext.unpersisted.db[shared.db.names.userFile.modelName];

    describe('[db/models/user-file] - methods.saveFileAndDoc', async () => {

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const userFileDoc = unpersistedUserFiles[0];
            const userFile = new db.models.UserFile(userFileDoc);

            await expect(userFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const userFileDoc = unpersistedUserFiles[1];
            const userFile = new db.models.UserFile(userFileDoc);

            await expect(userFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error is userFile.save fails validation/uniqueness', async () => {

            const userFileDoc = unpersistedUserFiles[2];
            const userFile = new db.models.UserFile(userFileDoc);

            await expect(userFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a user file that meets the requirements', async () => {

            const userFileDoc = unpersistedUserFiles[3];
            const userFile = new db.models.UserFile(userFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(userFile.file.originalname);

            await expect(userFile.saveFileAndDoc(buffer)).to.eventually.eql(userFile);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.userFile.modelName]);

            expect(bucketKeys).to.include(userFile.file.keyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveUserFileContext.persisted));

});
