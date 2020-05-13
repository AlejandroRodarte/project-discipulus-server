const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const StudentFile = require('../../../../src/db/models/student-file');

const { uniqueStudentFileContext } = require('../../../__fixtures__/models');
const { saveStudentFileContext, removeStudentFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/student-file] - uniqueStudentFile context', () => {

    beforeEach(db.init(uniqueStudentFileContext.persisted));

    describe('[db/models/student-file] - user/file.originalname index', () => {

        const unpersistedStudentFiles = uniqueStudentFileContext.unpersisted[names.studentFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const studentFile = new StudentFile(unpersistedStudentFiles[0]);
            await expect(studentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const studentFile = new StudentFile(unpersistedStudentFiles[1]);
            await expect(studentFile.save()).to.eventually.be.eql(studentFile);
        });

    });

    afterEach(db.teardown(uniqueStudentFileContext.persisted));

});

describe('[db/models/student-file] - removeStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeStudentFileContext.persisted));

    describe('[db/models/student-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedStudentFiles = removeStudentFileContext.persisted.db[names.studentFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(storageApi, 'deleteBucketObjects');

            const studentFileOneId = persistedStudentFiles[0]._id;
            const studentFile = await StudentFile.findOne({ _id: studentFileOneId });

            await expect(studentFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, bucketNames[names.studentFile.modelName], [studentFile.file.keyname]);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.studentFile.modelName]);

            expect(bucketKeys).to.not.include(studentFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(dbStorage.teardown(removeStudentFileContext.persisted));

});

describe('[db/models/student-file] - saveStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(saveStudentFileContext.persisted));

    const unpersistedDb = saveStudentFileContext.unpersisted.db;

    describe('[db/models/student-file] - methods.saveFileAndDoc', async () => {

        const unpersistedStudentFiles = unpersistedDb[names.studentFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const studentFileDoc = unpersistedStudentFiles[0];
            const studentFile = new StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const studentFileDoc = unpersistedStudentFiles[1];
            const studentFile = new StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a user that is not a student', async () => {

            const studentFileDoc = unpersistedStudentFiles[2];
            const studentFile = new StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should throw error is studentFile.save fails validation/uniqueness', async () => {

            const studentFileDoc = unpersistedStudentFiles[3];
            const studentFile = new StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a student file that meets the requirements', async () => {

            const studentFileDoc = unpersistedStudentFiles[4];
            const studentFile = new StudentFile(studentFileDoc);

            const buffer = getAssetBuffer(studentFile.file.originalname);

            await expect(studentFile.saveFileAndDoc(buffer)).to.eventually.eql(studentFile);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.studentFile.modelName]);

            expect(bucketKeys).to.include(studentFile.file.keyname);

        });

    });

    this.afterEach(dbStorage.teardown(saveStudentFileContext.persisted));

});
