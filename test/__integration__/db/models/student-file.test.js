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

describe('[db/models/student-file] - uniqueStudentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueStudentFileContext.persisted));

    describe('[db/models/student-file] - user/file.originalname index', () => {

        const unpersistedStudentFiles = fixtures.models.uniqueStudentFileContext.unpersisted[shared.db.names.studentFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const studentFile = new db.models.StudentFile(unpersistedStudentFiles[0]);
            await expect(studentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const studentFile = new db.models.StudentFile(unpersistedStudentFiles[1]);
            await expect(studentFile.save()).to.eventually.be.eql(studentFile);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueStudentFileContext.persisted));

});

describe('[db/models/student-file] - removeStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeStudentFileContext.persisted));

    describe('[db/models/student-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedStudentFiles = fixtures.modelsStorage.removeStudentFileContext.persisted.db[shared.db.names.studentFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(api.storage, 'deleteBucketObjects');

            const studentFileOneId = persistedStudentFiles[0]._id;
            const studentFile = await db.models.StudentFile.findOne({ _id: studentFileOneId });

            await expect(studentFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, api.storage.config.bucketNames[shared.db.names.studentFile.modelName], [studentFile.file.keyname]);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.studentFile.modelName]);

            expect(bucketKeys).to.not.include(studentFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeStudentFileContext.persisted));

});

describe('[db/models/student-file] - saveStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveStudentFileContext.persisted));

    const unpersistedDb = fixtures.modelsStorage.saveStudentFileContext.unpersisted.db;

    describe('[db/models/student-file] - methods.saveFileAndDoc', async () => {

        const unpersistedStudentFiles = unpersistedDb[shared.db.names.studentFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const studentFileDoc = unpersistedStudentFiles[0];
            const studentFile = new db.models.StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const studentFileDoc = unpersistedStudentFiles[1];
            const studentFile = new db.models.StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a user that is not a student', async () => {

            const studentFileDoc = unpersistedStudentFiles[2];
            const studentFile = new db.models.StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should throw error is studentFile.save fails validation/uniqueness', async () => {

            const studentFileDoc = unpersistedStudentFiles[3];
            const studentFile = new db.models.StudentFile(studentFileDoc);

            await expect(studentFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a student file that meets the requirements', async () => {

            const studentFileDoc = unpersistedStudentFiles[4];
            const studentFile = new db.models.StudentFile(studentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(studentFile.file.originalname);

            await expect(studentFile.saveFileAndDoc(buffer)).to.eventually.eql(studentFile);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.studentFile.modelName]);

            expect(bucketKeys).to.include(studentFile.file.keyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveStudentFileContext.persisted));

});
