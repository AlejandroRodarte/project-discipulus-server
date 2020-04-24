const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const User = require('../../../../src/db/models/user');
const userContexts = require('../../../__fixtures__/functions/db/models/user');

const { sampleUser } = require('../../../__fixtures__/models/user/persisted');
const { nonUniqueUsers, uniqueUsers } = require('../../../__fixtures__/models/user/unpersisted');

const expect = chai.expect;
chai.use(chaiAsPromised);

beforeEach(userContexts.sampleUser.init);

describe('[db/models/user] - Non-unique names', () => {

    it('Should persist a user with a non-unique name', async () => {
        const user = new User(nonUniqueUsers.nonUniqueName);
        await expect(user.save()).to.eventually.be.eql(user);
    });

});

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

        const persistedUser = await User.findOne({ _id: sampleUser._id });

        const unpersistedUser = new User(uniqueUsers[0]);
        unpersistedUser.avatar.keyname = persistedUser.avatar.keyname;

        await expect(unpersistedUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);

    });

});

describe('[db/models/user] - Unique username, email and avatar keyname', () => {

    it('Should persist a user with a required unique fields', async () => {
        const user = new User(uniqueUsers[0]);
        await expect(user.save()).to.eventually.be.eql(user);
    });

});

describe('[db/models/user] - Pre validate file hook', () => {

    it('Should not regenerate a new file keyname upon user model update', async () => {

        const user = await User.findOne({ _id: sampleUser._id });
        const oldAvatarKeyname = user.avatar.keyname;

        const updatedUser = await user.save();
        expect(updatedUser.avatar.keyname).to.equal(oldAvatarKeyname);

    });

});

describe('[db/models/user] - Pre save hook', () => {

    it('Should persist a user with a hashed password', async () => {

        const user = await User.findOne({ _id: sampleUser._id });

        expect(user.password.length).to.equal(60);
        expect(user.password).to.not.equal(sampleUser.password);

    });

});

afterEach(userContexts.sampleUser.teardown);
