const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ParentFile } = require('../../../../src/db/models');

const { baseParentFileContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { parentFile } = require('../../../../src/db/names');

const baseParentFileContextModelNames = Object.keys(baseParentFileContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-file] - baseParentFile context', () => {

    beforeEach(db.init(baseParentFileContext.persisted));

    describe('[db/models/parent-file] - File keyname', () => {

        const persistedParentFile = baseParentFileContext.persisted[parentFile.modelName];
        const unpersistedParentFile = baseParentFileContext.unpersisted[parentFile.modelName]

        it('Should not persist a parent-file which has a non-unique file keyname', async () => {

            const oldParentFile = await ParentFile.findOne({ _id: persistedParentFile[0]._id })
            const unpersistedParentFileDoc = unpersistedParentFile[0];

            const newParentFile = new ParentFile(unpersistedParentFileDoc);
            newParentFile.file.keyname = oldParentFile.file.keyname;

            await expect(newParentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist a unique parent-file', async () => {

            const unpersistedParentFileDoc = unpersistedParentFile[0];
            const parentFile = new ParentFile(unpersistedParentFileDoc);

            await expect(parentFile.save()).to.eventually.be.eql(parentFile);

        });

    });

    afterEach(db.teardown(baseParentFileContextModelNames));

});
