const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const { Class, ClassFile } = require('../../../../src/db/models');

const { uniqueClassFileContext, baseClassFileContext } = require('../../../__fixtures__/models');
const { removeClassFileContext } = require('../../../__fixtures__/models-storage');

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
