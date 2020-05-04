const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Types } = require('mongoose');

const UserFile = require('../../../../src/db/models/user-file');

const { uniqueUserFileContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { userFile } = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-file] - uniqueUserFile context', () => {

    beforeEach(db.init(uniqueUserFileContext.persisted));

    describe('[db/models/user-file] - user/file.originalname index', () => {

        const unpersistedUsersFiles = uniqueUserFileContext.unpersisted[userFile.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const userFileDoc = new UserFile(unpersistedUsersFiles[0]);
            await expect(userFileDoc.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const userFileDoc = new UserFile(unpersistedUsersFiles[1]);
            await expect(userFileDoc.save()).to.eventually.be.eql(userFileDoc);
        });

    });

    afterEach(db.teardown(uniqueUserFileContext.persisted));

});
