const { Types } = require('mongoose');

const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user] - uniqueUser context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueUserContext.persisted));

    const persistedUsers = fixtures.models.uniqueUserContext.persisted[shared.db.names.user.modelName];
    const unpersistedUsers = fixtures.models.uniqueUserContext.unpersisted[shared.db.names.user.modelName];

    describe('[db/models/user] - Non-unique names', () => {

        const nonUniqueUserDoc = unpersistedUsers[1];

        it('Should persist a user with a non-unique name', async () => {
            const user = new db.models.User(nonUniqueUserDoc);
            await expect(user.save()).to.eventually.be.eql(user);
        });
    
    });
    
    describe('[db/models/user] - Non-unique usernames', () => {
    
        const userDoc = unpersistedUsers[2];

        it('Should not persist a user with a non-unique username', async () => {
            const user = new db.models.User(userDoc);
            await expect(user.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/user] - Non-unique emails', () => {
    
        const userDoc = unpersistedUsers[3];

        it('Should not persist a user with a non-unique email', async () => {
            const user = new db.models.User(userDoc);
            await expect(user.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/user] - Unique username and email', () => {

        const userDoc = unpersistedUsers[0];

        it('Should persist a user with a required unique fields', async () => {
            const user = new db.models.User(userDoc);
            await expect(user.save()).to.eventually.be.eql(user);
        });
    
    });
    
    describe('[db/models/user] - Pre save hook', () => {

        const userOne = persistedUsers[0];
        const userOneId = userOne._id;

        it('Should persist a user with a hashed password', async () => {
    
            const user = await db.models.User.findOne({ _id: userOneId });
    
            expect(user.password.length).to.equal(60);
            expect(user.password).to.not.equal(userOne.password);
    
        });
    
    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueUserContext.persisted));

});

describe('[db/models/user] - baseUserRole context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserRoleContext.persisted));

    const persistedUsers = fixtures.models.baseUserRoleContext.persisted[shared.db.names.user.modelName];

    const userOneId = persistedUsers[0]._id;

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        it('Should remove user-role association upon user deletion', async () => {

            const user = await db.models.User.findOne({ _id: userOneId });
            await user.remove();

            const userRoleDocCount = await db.models.UserRole.countDocuments({
                user: userOneId
            });

            expect(userRoleDocCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    describe('[db/models/user] - methods.getUserRoles', () => {

        const persistedUsers = fixtures.models.baseUserRoleContext.persisted[shared.db.names.user.modelName];

        const userTwoId = persistedUsers[1]._id;
        const userThreeId = persistedUsers[2]._id;

        it('Should return an array of rolenames on user with roles', async () => {

            const user = await db.models.User.findOne({ _id: userTwoId });
            const roles = await user.getUserRoles();

            expect(roles.length).to.equal(2);

            const [roleOne, roleTwo] = roles;

            expect(roleOne).to.equal(shared.roles.ROLE_ADMIN);
            expect(roleTwo).to.equal(shared.roles.ROLE_PARENT);

        });

        it ('Should return an empty array on user without roles', async () => {

            const user = await db.models.User.findOne({ _id: userThreeId });
            const roles = await user.getUserRoles();

            expect(roles.length).to.equal(0);

        });

    });

    describe('[db/models/user] - methods.hasRole', () => {

        const persistedUsers = fixtures.models.baseUserRoleContext.persisted[shared.db.names.user.modelName];

        const userOneId = persistedUsers[0]._id;
        const userTwoId = persistedUsers[2]._id;

        it('Should return true on user that has a role', async () => {

            const user = await db.models.User.findOne({ _id: userOneId });
            const hasRole = await user.hasRole(shared.roles.ROLE_ADMIN);

            expect(hasRole).to.equal(true);

        });

        it('Should return false on user that does not have a role', async () => {

            const user = await db.models.User.findOne({ _id: userTwoId });
            const hasRole = await user.hasRole(shared.roles.ROLE_STUDENT);

            expect(hasRole).to.equal(false);

        });

    });

    describe('[db/models/user] - statics.findByIdAndValidateRole', () => {

        const role = shared.roles.ROLE_PARENT;

        const errors = {
            notFoundErrorMessage: 'User not found',
            invalidRoleErrorMessage: 'Invalid role'
        };

        it('Should throw error if user does not exist', async () => {
            await expect(db.models.User.findByIdAndValidateRole(new Types.ObjectId(), role, errors)).to.eventually.be.rejectedWith(Error, errors.notFoundErrorMessage);
        });

        it('Should throw error if user is disabled', async () => {
            const userFourId = persistedUsers[3]._id;
            await expect(db.models.User.findByIdAndValidateRole(userFourId, role, errors)).to.eventually.be.rejectedWith(Error, errors.notFoundErrorMessage);
        });

        it('Should throw error if user does not have the role included as arg', async () => {
            const userOneId = persistedUsers[0]._id;
            await expect(db.models.User.findByIdAndValidateRole(userOneId, role, errors)).to.eventually.be.rejectedWith(Error, errors.invalidRoleErrorMessage);
        });

        it('Should return user instance if all validations pass', async () => {

            const userTwoId = persistedUsers[1]._id;
            const user = await db.models.User.findByIdAndValidateRole(userTwoId, role, errors);

            expect(userTwoId.toHexString()).to.equal(user._id.toHexString());

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserRoleContext.persisted));

});

describe('[db/models/user] - baseParentStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseParentStudentContext.persisted));

    const persistedUsers = fixtures.models.baseParentStudentContext.persisted[shared.db.names.user.modelName];

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        it('Should delete associated parentStudent records upon student user deletion', async () => {
            
            const userSevenId = persistedUsers[6]._id;
            const userSeven = await db.models.User.findOne({ _id: userSevenId });

            await userSeven.remove();

            const docCount = await db.models.ParentStudent.countDocuments({
                student: userSevenId
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete associated parentStudent records upon parent deletion', async () => {

            const userSixId = persistedUsers[5]._id;
            const userSix = await db.models.User.findOne({ _id: userSixId });

            await userSix.remove();

            const docCount = await db.models.ParentStudent.countDocuments({
                parent: userSixId
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete associated parentStudent records upon user that is both a student and a parent', async () => {

            const userFiveId = persistedUsers[4]._id;
            const userFive = await db.models.User.findOne({ _id: userFiveId });

            await userFive.remove();

            const parentDocCount = await db.models.ParentStudent.countDocuments({
                parent: userFiveId
            });

            const studentDocCount = await db.models.ParentStudent.countDocuments({
                student: userFiveId
            });

            expect(parentDocCount).to.equal(0);
            expect(studentDocCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseParentStudentContext.persisted));

});

describe('[db/models/user] - baseParentStudentInvitation context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseParentStudentInvitationContext.persisted));

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseParentStudentInvitationContext.persisted[shared.db.names.user.modelName];

        it('Should delete associated parentStudentInvitation records upon parent user deletion', async () => {

            const userOneId = persistedUsers[0]._id;

            const user = await db.models.User.findOne({ _id: userOneId });
            await user.remove();

            const docCount = await db.models.ParentStudentInvitation.countDocuments({
                parent: userOneId
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete associated parentStudentInvitation records upon student user deletion', async () => {

            const userSevenId = persistedUsers[6]._id;

            const user = await db.models.User.findOne({ _id: userSevenId });
            await user.remove();

            const docCount = await db.models.ParentStudentInvitation.countDocuments({
                student: userSevenId
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete associated parentStudentInvitation records upon user deletion that is both student and parent', async () => {

            const userFiveId = persistedUsers[4]._id;

            const user = await db.models.User.findOne({ _id: userFiveId });
            await user.remove();

            const parentDocCount = await db.models.ParentStudentInvitation.countDocuments({
                parent: userFiveId
            });

            const studentDocCount = await db.models.ParentStudentInvitation.countDocuments({
                student: userFiveId
            });

            expect(parentDocCount).to.equal(0);
            expect(studentDocCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseParentStudentInvitationContext.persisted));

});

describe('[db/models/user] - baseUserFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserFileContext.persisted));

    const persistedUsers = fixtures.models.baseUserFileContext.persisted[shared.db.names.user.modelName];

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const userOneId = persistedUsers[0]._id;

        it('Should delete all associated user files upon user deletion', async () => {

            const user = await db.models.User.findOne({ _id: userOneId });

            await user.remove();

            const docCount = await db.models.UserFile.countDocuments({
                user: userOneId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserFileContext.persisted));

});

describe('[db/models/user] - baseParentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseParentFileContext.persisted));

    const persistedUsers = fixtures.models.baseParentFileContext.persisted[shared.db.names.user.modelName];

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const parentId = persistedUsers[0]._id;

        it('Should delete all associated parent files upon user deletion (with parent role)', async () => {

            const parent = await db.models.User.findOne({ _id: parentId });

            await parent.remove();

            const docCount = await db.models.ParentFile.countDocuments({
                user: parentId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseParentFileContext.persisted));

});

describe('[db/models/user] - baseStudentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseStudentFileContext.persisted));

    const persistedUsers = fixtures.models.baseStudentFileContext.persisted[shared.db.names.user.modelName];

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const studentId = persistedUsers[0]._id;

        it('Should delete all associated student files upon user deletion (with student role)', async () => {

            const student = await db.models.User.findOne({ _id: studentId });

            await student.remove();

            const docCount = await db.models.StudentFile.countDocuments({
                user: studentId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseStudentFileContext.persisted));

});

describe('[db/models/user] - baseTeacherFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseTeacherFileContext.persisted));

    const persistedUsers = fixtures.models.baseTeacherFileContext.persisted[shared.db.names.user.modelName];

    describe('[db/models/user] - Pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const teacherId = persistedUsers[0]._id;

        it('Should delete all associated teacher files upon user deletion (with teacher role)', async () => {

            const teacher = await db.models.User.findOne({ _id: teacherId });

            await teacher.remove();

            const docCount = await db.models.TeacherFile.countDocuments({
                user: teacherId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseTeacherFileContext.persisted));

});

describe('[db/models/user] - userAvatar context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.userAvatarContext.persisted));

    const persistedUsers = fixtures.modelsStorage.userAvatarContext.persisted.db[shared.db.names.user.modelName];
    const persistedAvatars = fixtures.modelsStorage.userAvatarContext.persisted.storage[shared.db.names.user.modelName];

    const unpersistedAvatars = fixtures.modelsStorage.userAvatarContext.unpersisted.storage[shared.db.names.user.modelName];

    describe('[db/models/user] - methods.saveAvatar', () => {

        it('Should throw error if a user attempt to save an avatar that is not a valid image', async () => {

            const documentFile = unpersistedAvatars[0];
            const buffer = fixtures.functions.assets.getAssetBuffer(documentFile.originalname);

            const userOneId = persistedUsers[0]._id;
            const userOne = await db.models.User.findOne({ _id: userOneId });

            await expect(userOne.saveAvatar(documentFile, buffer)).to.eventually.be.rejectedWith(MongooseError.ValidationError);

        });

        it('Should allow a user with no avatar to save an avatar properly if its of the correct type', async () => {

            const avatarFile = unpersistedAvatars[1];
            const buffer = fixtures.functions.assets.getAssetBuffer(avatarFile.originalname);

            const userOneId = persistedUsers[0]._id;
            const userOne = await db.models.User.findOne({ _id: userOneId });

            await expect(userOne.saveAvatar(avatarFile, buffer)).to.eventually.be.eql(userOne);

            const res = await api.storage.getMultipartObject(api.storage.config.bucketNames[shared.db.names.user.modelName], userOne.avatar.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(userOne.avatar.mimetype);

        });

        it('Should allow a user with avatar to replace it with another one', async () => {

            const avatarFile = unpersistedAvatars[1];
            const buffer = fixtures.functions.assets.getAssetBuffer(avatarFile.originalname);

            const userTwoId = persistedUsers[1]._id;
            const userTwo = await db.models.User.findOne({ _id: userTwoId });

            await expect(userTwo.saveAvatar(avatarFile, buffer)).to.eventually.be.eql(userTwo);

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.user.modelName]);

            const oldAvatarKeyname = persistedAvatars[0].keyname;

            expect(bucketKeys.length).to.equal(1);
            expect(bucketKeys).to.not.include(oldAvatarKeyname);

            const res = await api.storage.getMultipartObject(api.storage.config.bucketNames[shared.db.names.user.modelName], userTwo.avatar.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(userTwo.avatar.mimetype);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.userAvatarContext.persisted));

});

describe('[db/models/user] - removeAllUserFiles context', function() {

    this.timeout(30000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeAllUserFilesContext.persisted));

    const persistedUsers = fixtures.modelsStorage.removeAllUserFilesContext.persisted.db[shared.db.names.user.modelName];

    describe('[db/models/user] - pre remove hook', () => {

        it('Should remove all associated files on user removal', async () => {

            const userId = persistedUsers[0]._id;
            const userToDelete = await db.models.User.findOne({ _id: userId });

            await expect(userToDelete.remove()).to.eventually.be.fulfilled;

            const avatarKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.user.modelName]);
            const userFileKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.userFile.modelName]);
            const parentFileKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.parentFile.modelName]);
            const studentFileKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.studentFile.modelName]);
            const teacherFileKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.teacherFile.modelName]);

            expect(avatarKeys.length).to.equal(0);
            expect(userFileKeys.length).to.equal(0);
            expect(parentFileKeys.length).to.equal(0);
            expect(studentFileKeys.length).to.equal(0);
            expect(teacherFileKeys.length).to.equal(0);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeAllUserFilesContext.persisted));

});

describe('[db/models/user] - baseUserEvent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserEventContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseUserEventContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated user events upon user deletion', async () => {

            const userId = persistedUsers[0]._id;
            const user = await db.models.User.findOne({ _id: userId });

            await user.remove();
            
            const docCount = await db.models.UserEvent.countDocuments({
                user: userId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserEventContext.persisted));

});

describe('[db/models/user] - baseClass context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseClassContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated classes upon user deletion', async () => {

            const userId = persistedUsers[2]._id;
            const user = await db.models.User.findOne({ _id: userId });

            await user.remove();
            
            const docCount = await db.models.Class.countDocuments({
                user: userId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassContext.persisted));

});

describe('[db/models/user] - baseClassStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassStudentContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseClassStudentContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated class-student records upon student deletion', async () => {

            const userFourId = persistedUsers[3]._id;
            const userFour = await db.models.User.findOne({ _id: userFourId });

            await userFour.remove();

            const docCount = await db.models.ClassStudent.countDocuments({
                user: userFour._id
            });

            expect(docCount).to.equal(0);

        });

        it('Should delete all associated class-student-invitation records upon student deletion', async () => {

            const userFiveId = persistedUsers[4]._id;
            const userFive = await db.models.User.findOne({ _id: userFiveId });

            await userFive.remove();

            const docCount = await db.models.ClassStudentInvitation.countDocuments({
                user: userFive._id
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassStudentContext.persisted));

});

describe('[db/models/user] - baseUserNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserNoteContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseUserNoteContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated user-notes upon user deletion', async () => {

            const userOneId = persistedUsers[0]._id;
            const userOne = await db.models.User.findOne({ _id: userOneId });

            await userOne.remove();
            
            const docCount = await db.models.UserNote.countDocuments({
                user: userOneId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserNoteContext.persisted));

});

describe('[db/models/user] - baseParentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseParentNoteContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseParentNoteContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated parent-notes upon parent deletion', async () => {

            const userOneId = persistedUsers[0]._id;
            const userOne = await db.models.User.findOne({ _id: userOneId });

            await userOne.remove();
            
            const docCount = await db.models.ParentNote.countDocuments({
                user: userOneId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseParentNoteContext.persisted));

});

describe('[db/models/user] - baseStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseStudentNoteContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseStudentNoteContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated student-notes upon student deletion', async () => {

            const userOneId = persistedUsers[0]._id;
            const userOne = await db.models.User.findOne({ _id: userOneId });

            await userOne.remove();
            
            const docCount = await db.models.StudentNote.countDocuments({
                user: userOneId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseStudentNoteContext.persisted));

});

describe('[db/models/user] - baseTeacherNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseTeacherNoteContext.persisted));

    describe('[db/models/user] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => {
            deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves();
        });

        const persistedUsers = fixtures.models.baseTeacherNoteContext.persisted[shared.db.names.user.modelName];

        it('Should delete all associated teacher-notes upon teacher deletion', async () => {

            const userOneId = persistedUsers[0]._id;
            const userOne = await db.models.User.findOne({ _id: userOneId });

            await userOne.remove();
            
            const docCount = await db.models.TeacherNote.countDocuments({
                user: userOneId
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseTeacherNoteContext.persisted));

});
