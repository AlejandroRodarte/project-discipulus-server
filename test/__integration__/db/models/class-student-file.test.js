const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const { ClassStudentFile } = require('../../../../src/db/models');

const { uniqueClassStudentFileContext } = require('../../../__fixtures__/models');
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
