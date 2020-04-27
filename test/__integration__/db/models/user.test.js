const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const User = require('../../../../src/db/models/user');
const UserRole = require('../../../../src/db/models/user-role');

const { uniqueUserContext, baseUserRoleContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { user } = require('../../../../src/db/names');

const uniqueUserContextModelNames = Object.keys(uniqueUserContext.persisted);
const baseUserRoleContextModelNames = Object.keys(baseUserRoleContext.persisted);

const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user] - uniqueUser context', () => {

    beforeEach(db.init(uniqueUserContext.persisted));

    const persistedUser = uniqueUserContext.persisted[user.modelName][0];
    const persistedUserId = persistedUser._id;

    const uniqueUserDoc = uniqueUserContext.unpersisted[user.modelName][0];

    describe('[db/models/user] - Non-unique names', () => {

        const nonUniqueUserDoc = uniqueUserContext.unpersisted[user.modelName][1];

        it('Should persist a user with a non-unique name', async () => {
            const user = new User(nonUniqueUserDoc);
            await expect(user.save()).to.eventually.be.eql(user);
        });
    
    });
    
    describe('[db/models/user] - Non-unique usernames', () => {
    
        const nonUniqueUserDoc = uniqueUserContext.unpersisted[user.modelName][2];

        it('Should not persist a user with a non-unique username', async () => {
            const duplicateUser = new User(nonUniqueUserDoc);
            await expect(duplicateUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/user] - Non-unique emails', () => {
    
        const nonUniqueUserDoc = uniqueUserContext.unpersisted[user.modelName][3];

        it('Should not persist a user with a non-unique email', async () => {
            const duplicateUser = new User(nonUniqueUserDoc);
            await expect(duplicateUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/user] - Non-unique avatar keynames', () => {

        it('Should not persist a user with a non-unique avatar keyname', async () => {
    
            const persistedUser = await User.findOne({ _id: persistedUserId });
    
            const unpersistedUser = new User(uniqueUserDoc);
            unpersistedUser.avatar.keyname = persistedUser.avatar.keyname;
    
            await expect(unpersistedUser.save()).to.eventually.be.rejectedWith(mongo.MongoError);
    
        });
    
    });
    
    describe('[db/models/user] - Unique username, email and avatar keyname', () => {

        it('Should persist a user with a required unique fields', async () => {
            const user = new User(uniqueUserDoc);
            await expect(user.save()).to.eventually.be.eql(user);
        });
    
    });
    
    describe('[db/models/user] - Pre validate file hook', () => {

        it('Should not regenerate a new file keyname upon user model update', async () => {
    
            const user = await User.findOne({ _id: persistedUserId });
            const oldAvatarKeyname = user.avatar.keyname;
    
            const updatedUser = await user.save();
            expect(updatedUser.avatar.keyname).to.equal(oldAvatarKeyname);
    
        });
    
    });
    
    describe('[db/models/user] - Pre save hook', () => {

        it('Should persist a user with a hashed password', async () => {
    
            const user = await User.findOne({ _id: persistedUserId });
    
            expect(user.password.length).to.equal(60);
            expect(user.password).to.not.equal(persistedUser.password);
    
        });
    
    });

    afterEach(db.teardown(uniqueUserContextModelNames));

});

describe('[db/models/user] - baseUserRole context', () => {

    beforeEach(db.init(baseUserRoleContext.persisted));

    const persistedUserId = baseUserRoleContext.persisted[user.modelName][0]._id;

    describe('[db/models/user] - Pre remove hook', () => {

        it('Should remove user-role association upon user deletion', async () => {

            const user = await User.findOne({ _id: persistedUserId });
            await user.remove();

            const userRoleDocCount = await UserRole.countDocuments({
                user: persistedUserId
            });

            expect(userRoleDocCount).to.equal(0);

        });

    });

    describe('[db/models/user] - getUserRoles', () => {

        const users = baseUserRoleContext.persisted[user.modelName];

        const userTwoId = users[1]._id;
        const userThreeId = users[2]._id;

        it('Should return an array of rolenames on user with roles', async () => {

            const user = await User.findOne({ _id: userTwoId });
            const roles = await user.getUserRoles();

            expect(roles.length).to.equal(2);

            const [roleOne, roleTwo] = roles;

            expect(roleOne).to.equal(roleTypes.ROLE_ADMIN);
            expect(roleTwo).to.equal(roleTypes.ROLE_PARENT);

        });

        it ('Should return an empty array on user without roles', async () => {

            const user = await User.findOne({ _id: userThreeId });
            const roles = await user.getUserRoles();

            expect(roles.length).to.equal(0);

        });

    });

    afterEach(db.teardown(baseUserRoleContextModelNames));

});
