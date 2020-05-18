const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-file] - uniqueClassStudentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassStudentFileContext.persisted));

    const unpersistedClassStudentFiles = fixtures.models.uniqueClassStudentFileContext.unpersisted[shared.db.names.classStudentFile.modelName];

    describe('[db/models/class-student-file] - class/file.originalname index', () => {

        it('Should not persist non-unique class/file.originalname classStudentFile', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[0];
            const classStudentFile = new db.models.ClassStudentFile(classStudentFileDoc);

            await expect(classStudentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist unique class/file.originalname classStudentFile', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[1];
            const classStudentFile = new db.models.ClassStudentFile(classStudentFileDoc);

            await expect(classStudentFile.save()).to.eventually.eql(classStudentFile);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassStudentFileContext.persisted));

});

describe('[db/models/class-student-file] - removeClassStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeClassStudentFileContext.persisted));

    const persistedClassStudentFiles = fixtures.modelsStorage.removeClassStudentFileContext.persisted.db[shared.db.names.classStudentFile.modelName];

    describe('[db/models/class-student-file] - pre remove hook', () => {

        it('Should remove associated file upon model instance deletion', async () => {

            const classStudentFileOneId = persistedClassStudentFiles[0]._id;
            const classStudentFileOne = await db.models.ClassStudentFile.findOne({ _id: classStudentFileOneId });

            const classFileOneKeyname = classStudentFileOne.file.keyname;

            await classStudentFileOne.remove();

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.classStudentFile.modelName]);
            expect(bucketKeys).to.not.include(classFileOneKeyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeClassStudentFileContext.persisted));

});

describe('[db/models/class-student-file] - saveClassStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveClassStudentFileContext.persisted));

    const unpersistedClassStudentFiles = fixtures.modelsStorage.saveClassStudentFileContext.unpersisted.db[shared.db.names.classStudentFile.modelName];

    describe('[db/models/class-student-file] - methods.saveFileAndDoc', () => {

        it('Should not upload file if associated class-student does not exist', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[0];
            const classStudentFile = new db.models.ClassStudentFile(classStudentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(classStudentFile.file.originalname);

            await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentNotFound);

        });

        it('Should not upload file if class-student-file fails on model instance save (non-unique)', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[1];
            const classStudentFile = new db.models.ClassStudentFile(classStudentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(classStudentFile.file.originalname);

            await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly upload correct class file', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[2];
            const classStudentFile = new db.models.ClassStudentFile(classStudentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(classStudentFile.file.originalname);

            await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.eql(classStudentFile);

            const res = await api.storage.getMultipartObject(api.storage.config.bucketNames[shared.db.names.classStudentFile.modelName], classStudentFile.file.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(classStudentFile.file.mimetype);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveClassStudentFileContext.persisted));

});
