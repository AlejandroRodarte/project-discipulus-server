const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const { Class, ClassFile } = require('../../../../src/db/models');

const { uniqueClassFileContext, baseClassFileContext } = require('../../../__fixtures__/models');
const { } = require('../../../__fixtures__/models-storage');

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

describe('[db/models/class-file] - baseClassFile context', () => {

    beforeEach(db.init(baseClassFileContext.persisted));
    
    const persistedClasses = baseClassFileContext.persisted[names.class.modelName];

    describe('[db/models/class-file] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').resolves());

        it('Should delete all associated class files upon class deletion', async () => {

            const classOneId = persistedClasses[0]._id;
            const clazz = await Class.findOne({ _id: classOneId });

            await clazz.remove();

            const docCount = await ClassFile.countDocuments({
                class: classOneId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(db.teardown(baseClassFileContext.persisted));

});
