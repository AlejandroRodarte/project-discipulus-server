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

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/student-file] - uniqueStudentFile context', () => {

    beforeEach(db.init(uniqueStudentFileContext.persisted));

    describe('[db/models/student-file] - user/file.originalname index', () => {

        const unpersistedStudentFiles = uniqueStudentFileContext.unpersisted[names.studentFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const studentFileDoc = new StudentFile(unpersistedStudentFiles[0]);
            await expect(studentFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const studentFileDoc = new StudentFile(unpersistedStudentFiles[1]);
            await expect(studentFileDoc.save()).to.eventually.be.eql(studentFileDoc);
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

            const unknownStudentFileDoc = unpersistedStudentFiles[0];
            const unknownStudentFile = new StudentFile(unknownStudentFileDoc);

            await expect(unknownStudentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const disabledStudentFileDoc = unpersistedStudentFiles[1];
            const disabledStudentFile = new StudentFile(disabledStudentFileDoc);

            await expect(disabledStudentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error if a file is persisted to a user that is not a student', async () => {

            const notAStudentFileDoc = unpersistedStudentFiles[2];
            const notAStudentFile = new StudentFile(notAStudentFileDoc);

            await expect(notAStudentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error is studentFile.save fails validation/uniqueness', async () => {

            const nonUniqueStudentFileDoc = unpersistedStudentFiles[3];
            const nonUniqueStudentFile = new StudentFile(nonUniqueStudentFileDoc);

            await expect(nonUniqueStudentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

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
