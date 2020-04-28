const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { User, UserRole, ParentStudent } = require('../../../../src/db/models');

const { uniqueUserContext, baseUserRoleContext, baseParentStudentContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { user, parentStudent } = require('../../../../src/db/names');

const uniqueUserContextModelNames = Object.keys(uniqueUserContext.persisted);
const baseUserRoleContextModelNames = Object.keys(baseUserRoleContext.persisted);
const baseParentStudentContextModelNames = Object.keys(baseParentStudentContext.persisted);

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

    describe('[db/models/user] - methods.getUserRoles', () => {

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

    describe('[db/models/user] - methods.hasRole', () => {

        const users = baseUserRoleContext.persisted[user.modelName];

        const userOneId = users[0]._id;
        const userTwoId = users[2]._id;

        it('Should return true on user that has a role', async () => {

            const user = await User.findOne({ _id: userOneId });
            const hasRole = await user.hasRole(roleTypes.ROLE_ADMIN);

            expect(hasRole).to.equal(true);

        });

        it('Should return false on user that does not have a role', async () => {

            const user = await User.findOne({ _id: userTwoId });
            const hasRole = await user.hasRole(roleTypes.ROLE_STUDENT);

            expect(hasRole).to.equal(false);

        });

    });

    afterEach(db.teardown(baseUserRoleContextModelNames));

});

describe('[db/models/user] - baseParentStudent context', () => {

    beforeEach(db.init(baseParentStudentContext.persisted));

    const persisted = baseParentStudentContext.persisted;

    describe('[db/models/user] - Pre remove hook', () => {

        const persistedUsers = persisted[user.modelName];
        const persistedParentStudents = persisted[parentStudent.modelName];

        it('Should delete associated parentStudent records upon student user deletion', async () => {
            
            const userSevenId = persistedUsers[6]._id;
            const userSeven = await User.findOne({ _id: userSevenId });

            await userSeven.remove();

            const docCount = await ParentStudent.countDocuments({
                student: userSevenId
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete associated parentStudent records upon parent deletion', async () => {

            const userSixId = persistedUsers[5]._id;
            const userSix = await User.findOne({ _id: userSixId });

            await userSix.remove();

            const docCount = await ParentStudent.countDocuments({
                parent: userSixId
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete associated parentStudent records upon user that is both a student and a parent', async () => {

            const userFiveId = persistedUsers[4]._id;
            const userFive = await User.findOne({ _id: userFiveId });

            await userFive.remove();

            const parentDocCount = await ParentStudent.countDocuments({
                parent: userFiveId
            });

            const studentDocCount = await ParentStudent.countDocuments({
                student: userFiveId
            });

            expect(parentDocCount).to.equal(0);
            expect(studentDocCount).to.equal(0);

        });

    });

    afterEach(db.teardown(baseParentStudentContextModelNames));

});
