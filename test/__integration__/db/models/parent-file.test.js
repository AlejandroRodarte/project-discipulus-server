const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserFile = require('../../../../src/db/models/parent-file');

const { uniqueParentFileContext } = require('../../../__fixtures__/models');
const { removeUserFileContext, saveUserFileContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const { parentFile: parentFileNames } = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-file] - uniqueParentFile context', () => {

    beforeEach(db.init(uniqueParentFileContext.persisted));

    describe('[db/models/parent-file] - user/file.originalname index', () => {

        const unpersistedParentFiles = uniqueParentFileContext.unpersisted[parentFileNames.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const parentFileDoc = new UserFile(unpersistedParentFiles[0]);
            await expect(parentFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const parentFileDoc = new UserFile(unpersistedParentFiles[1]);
            await expect(parentFileDoc.save()).to.eventually.be.eql(parentFileDoc);
        });

    });

    afterEach(db.teardown(uniqueParentFileContext.persisted));

});