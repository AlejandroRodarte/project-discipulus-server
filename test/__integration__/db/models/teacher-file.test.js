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

describe('[db/models/teacher-file] - uniqueTeacherFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueTeacherFileContext.persisted));

    describe('[db/models/teacher-file] - user/file.originalname index', () => {

        const unpersistedTeacherFiles = fixtures.models.uniqueTeacherFileContext.unpersisted[shared.db.names.teacherFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const teacherFile = new db.models.TeacherFile(unpersistedTeacherFiles[0]);
            await expect(teacherFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const teacherFile = new db.models.TeacherFile(unpersistedTeacherFiles[1]);
            await expect(teacherFile.save()).to.eventually.be.eql(teacherFile);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueTeacherFileContext.persisted));

});

describe('[db/models/teacher-file] - removeTeacherFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeTeacherFileContext.persisted));

    describe('[db/models/teacher-file] - pre remove hook', function() {

        let deleteBucketObjectsSpy;

        const persistedTeacherFiles = fixtures.modelsStorage.removeTeacherFileContext.persisted.db[shared.db.names.teacherFile.modelName];

        it('Should remove multipart file before deleting model instance', async () => {

            deleteBucketObjectsSpy = sinon.spy(api.storage, 'deleteBucketObjects');

            const teacherFileOneId = persistedTeacherFiles[0]._id;
            const teacherFile = await db.models.TeacherFile.findOne({ _id: teacherFileOneId });

            await expect(teacherFile.remove()).to.eventually.be.fulfilled;

            sinon.assert.calledOnceWithExactly(deleteBucketObjectsSpy, api.storage.config.bucketNames[shared.db.names.teacherFile.modelName], [teacherFile.file.keyname]);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.teacherFile.modelName]);

            expect(bucketKeys).to.not.include(teacherFile.file.keyname);

        });

        this.afterEach(() => {
            sinon.restore();
        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeTeacherFileContext.persisted));

});

describe('[db/models/teacher-file] - saveTeacherFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveTeacherFileContext.persisted));

    const unpersistedDb = fixtures.modelsStorage.saveTeacherFileContext.unpersisted.db;

    describe('[db/models/teacher-file] - methods.saveFileAndDoc', async () => {

        const unpersistedTeacherFiles = unpersistedDb[shared.db.names.teacherFile.modelName];

        it('Should throw error if a file is persisted to an unknown user', async () => {

            const teacherFileDoc = unpersistedTeacherFiles[0];
            const teacherFile = new db.models.TeacherFile(teacherFileDoc);

            await expect(teacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a disabled user', async () => {

            const teacherFileDoc = unpersistedTeacherFiles[1];
            const teacherFile = new db.models.TeacherFile(teacherFileDoc);

            await expect(teacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should throw error if a file is persisted to a user that is not a teacher', async () => {

            const teacherFileDoc = unpersistedTeacherFiles[2];
            const teacherFile = new db.models.TeacherFile(teacherFileDoc);

            await expect(teacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should throw error is teacherFile.save fails validation/uniqueness', async () => {

            const teacherFileDoc = unpersistedTeacherFiles[3];
            const teacherFile = new db.models.TeacherFile(teacherFileDoc);

            await expect(teacherFile.saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a teacher file that meets the requirements', async () => {

            const teacherFileDoc = unpersistedTeacherFiles[4];
            const teacherFile = new db.models.TeacherFile(teacherFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(teacherFile.file.originalname);

            await expect(teacherFile.saveFileAndDoc(buffer)).to.eventually.eql(teacherFile);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.teacherFile.modelName]);

            expect(bucketKeys).to.include(teacherFile.file.keyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveTeacherFileContext.persisted));

});
