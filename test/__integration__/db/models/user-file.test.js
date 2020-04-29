const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { UserFile } = require('../../../../src/db/models');

const { baseUserFileContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { userFile } = require('../../../../src/db/names');

const baseUserFileContextModelNames = Object.keys(baseUserFileContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-file] - baseUserFile context', () => {

    beforeEach(db.init(baseUserFileContext.persisted));

    describe('[db/models/user-file] - File keyname', () => {

        const persistedUserFiles = baseUserFileContext.persisted[userFile.modelName];
        const unpersistedUserFiles = baseUserFileContext.unpersisted[userFile.modelName]

        it('Should not persist a user-file which has a non-unique file keyname', async () => {

            const oldUserFile = await UserFile.findOne({ _id: persistedUserFiles[0]._id })
            const unpersistedUserFileDoc = unpersistedUserFiles[0];

            const newUserFile = new UserFile(unpersistedUserFileDoc);
            newUserFile.file.keyname = oldUserFile.file.keyname;

            await expect(newUserFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist a unique user-file', async () => {

            const unpersistedUserFileDoc = unpersistedUserFiles[0];
            const userFile = new UserFile(unpersistedUserFileDoc);

            await expect(userFile.save()).to.eventually.be.eql(userFile);

        });

    });

    afterEach(db.teardown(baseUserFileContextModelNames));

});
