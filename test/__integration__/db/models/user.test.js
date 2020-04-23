const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const User = require('../../../../src/db/models/user');
const userContexts = require('../../../__fixtures__/functions/db/models/user');
const { nonUniqueUsers } = require('../../../__fixtures__/models/user/unpersisted');

const expect = chai.expect;
chai.use(chaiAsPromised);

beforeEach(userContexts.sampleUser.init);

describe('[db/models/user] - Non-unique usernames', () => {

    it('Should not persist a user with a non-unique username', async () => {
        const duplicateUser = new User(nonUniqueUsers.nonUniqueUsername);
        await expect(duplicateUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);
    });

});

describe('[db/models/user] - Non-unique emails', () => {

    it('Should not persist a user with a non-unique email', async () => {
        const duplicateUser = new User(nonUniqueUsers.nonUniqueEmail);
        await expect(duplicateUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);
    });

});

describe('[db/models/user] - Non-unique avatar keynames', () => {

    it('Should not persist a user with a non-unique avatar keyname', async () => {
        const duplicateUser = new User(nonUniqueUsers.nonUniqueAvatarKeyname);
        await expect(duplicateUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);
    });

});

afterEach(userContexts.sampleUser.teardown);
