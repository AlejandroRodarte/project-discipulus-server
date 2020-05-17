const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudentFile } = require('../../../../src/db/models');

const { uniqueClassStudentFileContext } = require('../../../__fixtures__/models');
const { removeClassStudentFileContext, saveClassStudentFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-file] - uniqueClassStudentFile context', () => {

    beforeEach(db.init(uniqueClassStudentFileContext.persisted));

    const unpersistedClassStudentFiles = uniqueClassStudentFileContext.unpersisted[names.classStudentFile.modelName];

    describe('[db/models/class-student-file] - class/file.originalname index', () => {

        it('Should not persist non-unique class/file.originalname classStudentFile', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[0];
            const classStudentFile = new ClassStudentFile(classStudentFileDoc);

            await expect(classStudentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist unique class/file.originalname classStudentFile', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[1];
            const classStudentFile = new ClassStudentFile(classStudentFileDoc);

            await expect(classStudentFile.save()).to.eventually.eql(classStudentFile);

        });

    });

    afterEach(db.teardown(uniqueClassStudentFileContext.persisted));

});

describe('[db/models/class-student-file] - removeClassStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeClassStudentFileContext.persisted));

    const persistedClassStudentFiles = removeClassStudentFileContext.persisted.db[names.classStudentFile.modelName];

    describe('[db/models/class-student-file] - pre remove hook', () => {

        it('Should remove associated file upon model instance deletion', async () => {

            const classStudentFileOneId = persistedClassStudentFiles[0]._id;
            const classStudentFileOne = await ClassStudentFile.findOne({ _id: classStudentFileOneId });

            const classFileOneKeyname = classStudentFileOne.file.keyname;

            await classStudentFileOne.remove();

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.classStudentFile.modelName]);
            expect(bucketKeys).to.not.include(classFileOneKeyname);

        });

    });

    this.afterEach(dbStorage.teardown(removeClassStudentFileContext.persisted));

});

describe('[db/models/class-student-file] - saveClassStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(saveClassStudentFileContext.persisted));

    const unpersistedClassStudentFiles = saveClassStudentFileContext.unpersisted.db[names.classStudentFile.modelName];

    describe('[db/models/class-student-file] - methods.saveFileAndDoc', () => {

        it('Should not upload file if associated class-student does not exist', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[0];
            const classStudentFile = new ClassStudentFile(classStudentFileDoc);

            const buffer = getAssetBuffer(classStudentFile.file.originalname);

            await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, modelErrorMessages.classStudentNotFound);

        });

        it('Should not upload file if class-student-file fails on model instance save (non-unique)', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[1];
            const classStudentFile = new ClassStudentFile(classStudentFileDoc);

            const buffer = getAssetBuffer(classStudentFile.file.originalname);

            await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly upload correct class file', async () => {

            const classStudentFileDoc = unpersistedClassStudentFiles[2];
            const classStudentFile = new ClassStudentFile(classStudentFileDoc);

            const buffer = getAssetBuffer(classStudentFile.file.originalname);

            await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.eql(classStudentFile);

            const res = await storageApi.getMultipartObject(bucketNames[names.classStudentFile.modelName], classStudentFile.file.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(classStudentFile.file.mimetype);

        });

    });

    this.afterEach(dbStorage.teardown(saveClassStudentFileContext.persisted));

});
