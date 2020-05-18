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

describe('[db/models/class-file] - uniqueClassFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassFileContext.persisted));

    const unpersistedClassFiles = fixtures.models.uniqueClassFileContext.unpersisted[shared.db.names.classFile.modelName];

    describe('[db/models/class-file] - class/file.originalname index', () => {

        it('Should not persist non-unique class/file.originalname classFile', async () => {

            const classFileDoc = unpersistedClassFiles[0];
            const classFile = new db.models.ClassFile(classFileDoc);

            await expect(classFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist unique class/file.originalname classFile', async () => {

            const classFileDoc = unpersistedClassFiles[1];
            const classFile = new db.models.ClassFile(classFileDoc);

            await expect(classFile.save()).to.eventually.eql(classFile);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassFileContext.persisted));

});

describe('[db/models/class-file] - removeClassFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeClassFileContext.persisted));

    const persistedClassFiles = fixtures.modelsStorage.removeClassFileContext.persisted.db[shared.db.names.classFile.modelName];

    describe('[db/models/class-file] - pre remove hook', () => {

        it('Should remove associated file upon model instance deletion', async () => {

            const classFileOneId = persistedClassFiles[0]._id;
            const classFile = await db.models.ClassFile.findOne({ _id: classFileOneId });

            const classFileOneKeyname = classFile.file.keyname;

            await classFile.remove();

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.classFile.modelName]);
            expect(bucketKeys).to.not.include(classFileOneKeyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeClassFileContext.persisted));

});

describe('[db/models/class-file] - saveClassFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveClassFileContext.persisted));

    const unpersistedClassFiles = fixtures.modelsStorage.saveClassFileContext.unpersisted.db[shared.db.names.classFile.modelName];

    describe('[db/models/class-file] - methods.saveFileAndDoc', () => {

        it('Should not upload file if associated class does not exist', async () => {

            const classFileDoc = unpersistedClassFiles[0];
            const classFile = new db.models.ClassFile(classFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(classFile.file.originalname);

            await expect(classFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not upload file if class-file fails on model instance save (non-unique)', async () => {

            const classFileDoc = unpersistedClassFiles[1];
            const classFile = new db.models.ClassFile(classFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(classFile.file.originalname);

            await expect(classFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly upload correct class file', async () => {

            const classFileDoc = unpersistedClassFiles[2];
            const classFile = new db.models.ClassFile(classFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(classFile.file.originalname);

            await expect(classFile.saveFileAndDoc(buffer)).to.eventually.eql(classFile);

            const res = await api.storage.getMultipartObject(api.storage.config.bucketNames[shared.db.names.classFile.modelName], classFile.file.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(classFile.file.mimetype);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveClassFileContext.persisted));

});
