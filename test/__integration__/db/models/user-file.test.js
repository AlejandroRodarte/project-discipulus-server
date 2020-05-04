const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Types } = require('mongoose');

const UserFile = require('../../../../src/db/models/user-file');

const { uniqueUserFileContext } = require('../../../__fixtures__/models');
const { removeUserFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const { userFile: userFileNames } = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-file] - uniqueUserFile context', () => {

    beforeEach(db.init(uniqueUserFileContext.persisted));

    describe('[db/models/user-file] - user/file.originalname index', () => {

        const unpersistedUsersFiles = uniqueUserFileContext.unpersisted[userFileNames.modelName];

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

describe('[db/models/user-file] - removeUserFileContext', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeUserFileContext.persisted));

    describe('[db/models/user-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedUserFiles = removeUserFileContext.persisted.db[userFileNames.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(storageApi, 'deleteBucketObjects');

            const userFileOneId = persistedUserFiles[0]._id;
            const userFile = await UserFile.findOne({ _id: userFileOneId });

            await expect(userFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, bucketNames[userFileNames.modelName], [userFile.file.keyname]);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[userFileNames.modelName]);

            expect(bucketKeys).to.not.include(userFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(dbStorage.teardown(removeUserFileContext.persisted));

});
