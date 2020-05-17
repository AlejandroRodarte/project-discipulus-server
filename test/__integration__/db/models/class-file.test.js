const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassFile } = require('../../../../src/db/models');

const { uniqueClassFileContext } = require('../../../__fixtures__/models');
const { removeClassFileContext, saveClassFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const names = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-file] - uniqueClassFile context', () => {

    beforeEach(db.init(uniqueClassFileContext.persisted));

    const unpersistedClassFiles = uniqueClassFileContext.unpersisted[names.classFile.modelName];

    describe('[db/models/class-file] - class/file.originalname index', () => {

        it('Should not persist non-unique class/file.originalname classFile', async () => {

            const classFileDoc = unpersistedClassFiles[0];
            const classFile = new ClassFile(classFileDoc);

            await expect(classFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist unique class/file.originalname classFile', async () => {

            const classFileDoc = unpersistedClassFiles[1];
            const classFile = new ClassFile(classFileDoc);

            await expect(classFile.save()).to.eventually.eql(classFile);

        });

    });

    afterEach(db.teardown(uniqueClassFileContext.persisted));

});

describe('[db/models/class-file] - removeClassFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(removeClassFileContext.persisted));

    const persistedClassFiles = removeClassFileContext.persisted.db[names.classFile.modelName];

    describe('[db/models/class-file] - pre remove hook', () => {

        it('Should remove associated file upon model instance deletion', async () => {

            const classFileOneId = persistedClassFiles[0]._id;
            const classFile = await ClassFile.findOne({ _id: classFileOneId });

            const classFileOneKeyname = classFile.file.keyname;

            await classFile.remove();

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[names.classFile.modelName]);
            expect(bucketKeys).to.not.include(classFileOneKeyname);

        });

    });

    this.afterEach(dbStorage.teardown(removeClassFileContext.persisted));

});

describe('[db/models/class-file] - saveClassFile context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(saveClassFileContext.persisted));

    const unpersistedClassFiles = saveClassFileContext.unpersisted.db[names.classFile.modelName];

    describe('[db/models/class-file] - methods.saveFileAndDoc', () => {

        it('Should not upload file if associated class does not exist', async () => {

            const classFileDoc = unpersistedClassFiles[0];
            const classFile = new ClassFile(classFileDoc);

            const buffer = getAssetBuffer(classFile.file.originalname);

            await expect(classFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, modelErrorMessages.classNotFound);

        });

        it('Should not upload file if class-file fails on model instance save (non-unique)', async () => {

            const classFileDoc = unpersistedClassFiles[1];
            const classFile = new ClassFile(classFileDoc);

            const buffer = getAssetBuffer(classFile.file.originalname);

            await expect(classFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly upload correct class file', async () => {

            const classFileDoc = unpersistedClassFiles[2];
            const classFile = new ClassFile(classFileDoc);

            const buffer = getAssetBuffer(classFile.file.originalname);

            await expect(classFile.saveFileAndDoc(buffer)).to.eventually.eql(classFile);

            const res = await storageApi.getMultipartObject(bucketNames[names.classFile.modelName], classFile.file.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(classFile.file.mimetype);

        });

    });

    this.afterEach(dbStorage.teardown(saveClassFileContext.persisted));

});
