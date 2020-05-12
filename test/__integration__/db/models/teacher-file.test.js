const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const TeacherFile = require('../../../../src/db/models/teacher-file');

const { uniqueTeacherFileContext } = require('../../../__fixtures__/models');
const { saveTeacherFileContext, removeTeacherFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/teacher-file] - uniqueTeacherFile context', () => {

    beforeEach(db.init(uniqueTeacherFileContext.persisted));

    describe('[db/models/teacher-file] - user/file.originalname index', () => {

        const unpersistedTeacherFiles = uniqueTeacherFileContext.unpersisted[names.teacherFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const teacherFileDoc = new TeacherFile(unpersistedTeacherFiles[0]);
            await expect(teacherFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const teacherFileDoc = new TeacherFile(unpersistedTeacherFiles[1]);
            await expect(teacherFileDoc.save()).to.eventually.be.eql(teacherFileDoc);
        });

    });

    afterEach(db.teardown(uniqueTeacherFileContext.persisted));

});

describe('[db/models/teacher-file] - removeTeacherFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeTeacherFileContext.persisted));

    describe('[db/models/teacher-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedTeacherFiles = removeTeacherFileContext.persisted.db[names.teacherFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(storageApi, 'deleteBucketObjects');

            const teacherFileOneId = persistedTeacherFiles[0]._id;
            const teacherFile = await TeacherFile.findOne({ _id: teacherFileOneId });

            await expect(teacherFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, bucketNames[names.teacherFile.modelName], [teacherFile.file.keyname]);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.teacherFile.modelName]);

            expect(bucketKeys).to.not.include(teacherFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(dbStorage.teardown(removeTeacherFileContext.persisted));

});

describe('[db/models/teacher-file] - saveTeacherFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(saveTeacherFileContext.persisted));

    const unpersistedDb = saveTeacherFileContext.unpersisted.db;

    describe('[db/models/teacher-file] - methods.saveFileAndDoc', async () => {

        const unpersistedTeacherFiles = unpersistedDb[names.teacherFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const unknownTeacherFileDoc = unpersistedTeacherFiles[0];
            const unknownTeacherFile = new TeacherFile(unknownTeacherFileDoc);

            await expect(unknownTeacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const disabledTeacherFileDoc = unpersistedTeacherFiles[1];
            const disabledTeacherFile = new TeacherFile(disabledTeacherFileDoc);

            await expect(disabledTeacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a user that is not a teacher', async () => {

            const notATeacherFileDoc = unpersistedTeacherFiles[2];
            const notATeacherFile = new TeacherFile(notATeacherFileDoc);

            await expect(notATeacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should throw error is teacherFile.save fails validation/uniqueness', async () => {

            const notUniqueTeacherFileDoc = unpersistedTeacherFiles[3];
            const notUniqueTeacherFile = new TeacherFile(notUniqueTeacherFileDoc);

            await expect(notUniqueTeacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a teacher file that meets the requirements', async () => {

            const teacherFileDoc = unpersistedTeacherFiles[4];
            const teacherFile = new TeacherFile(teacherFileDoc);

            const buffer = getAssetBuffer(teacherFile.file.originalname);

            await expect(teacherFile.saveFileAndDoc(buffer)).to.eventually.eql(teacherFile);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.teacherFile.modelName]);

            expect(bucketKeys).to.include(teacherFile.file.keyname);

        });

    });

    this.afterEach(dbStorage.teardown(saveTeacherFileContext.persisted));

});
