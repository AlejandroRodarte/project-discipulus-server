const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const User = require('../../../../src/db/models/user');
const { userDefinition } = require('../../../../src/db/schemas/user');
const modelFunctions = require('../../../__fixtures__/functions/models');

const { getRolesPipeline } = require('../../../../src/db/aggregation/user-role');

const { userRole } = require('../../../../src/db/names');
const roleTypes = require('../../../../src/util/roles');

const storageApi = require('../../../../src/api/storage');
const sampleFiles = require('../../../__fixtures__/shared/sample-files');

const bucketNames = require('../../../../src/api/storage/config/bucket-names');
const { user: userNames } = require('../../../../src/db/names');

const regexp = require('../../../../src/util/regexp');

const generateFakeUsers = require('../../../__fixtures__/functions/models/generate-fake-users');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = generateFakeUsers(1, { fakeToken: true });

let user = new User(userDoc);

beforeEach(() => user = modelFunctions.getNewModelInstance(User, userDoc));

describe('[db/models/user] - invalid name', () => {

    const [userMinLength] = userDefinition.name.minlength;
    const [userMaxLength] = userDefinition.name.maxlength;

    it('Should not validate a user without a name', () => {
        user.name = undefined;
        modelFunctions.testForInvalidModel(user, userDefinition.name.required);
    });

    it('Should not validate a user with a name that does not match the fullName regexp pattern', () => {
        user.name = 'Max+ User!';
        modelFunctions.testForInvalidModel(user, userDefinition.name.validate);
    });

    it('Should not validate a user with a name that does not match the singleName regexp pattern', () => {
        user.name = '.Peter';
        modelFunctions.testForInvalidModel(user, userDefinition.name.validate);
    });

    it('Should not validate a user with an explicit profane name', () => {
        user.name = 'Pussy Destroyer';
        modelFunctions.testForInvalidModel(user, userDefinition.name.validate);
    });

    it(`Should not validate a user with a name shorter than ${ userMinLength } characters`, () => {
        user.name = 'A';
        modelFunctions.testForInvalidModel(user, userDefinition.name.minlength);
    });

    it(`Should not validate a user with a name longer than ${ userMaxLength } characters`, () => {
        user.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';
        modelFunctions.testForInvalidModel(user, userDefinition.name.maxlength);
    });

});

describe('[db/models/user] - valid name', () => {

    it('Should validate a correct user name', () => {
        user.name = 'Brian O\' Connor';
        modelFunctions.testForValidModel(user);
    });

    it('Should trim a valid user name', () => {

        user.name = '   John        Smith    ';
        modelFunctions.testForValidModel(user);

        expect(user.name).to.equal('John Smith');

    });

});

describe('[db/models/user] - invalid username', () => {

    const [usernameMinLength] = userDefinition.username.minlength;
    const [usernameMaxLength] = userDefinition.username.maxlength;

    it('Should not validate a user without a username', () => {
        user.username = undefined;
        modelFunctions.testForInvalidModel(user, userDefinition.username.required);
    });

    it('Should not validate a user with a username that does not match the username regexp pattern', () => {
        user.username = 'max+!';
        modelFunctions.testForInvalidModel(user, userDefinition.username.validate);
    });

    it('Should not validate a user with a profane username', () => {
        user.username = 'anus';
        modelFunctions.testForInvalidModel(user, userDefinition.username.validate);
    });

    it(`Should not validate a user with a username shorter than ${ usernameMinLength } characters`, () => {
        user.username = 'cz';
        modelFunctions.testForInvalidModel(user, userDefinition.username.minlength);
    });

    it(`Should not validate a user with a username longer than ${ usernameMaxLength } characters`, () => {
        user.username = 'superlongusernamebruhohmygodsuperbadass';
        modelFunctions.testForInvalidModel(user, userDefinition.username.maxlength);
    });

});

describe('[db/models/user] - valid username', () => {

    it('Should validate a correct username', () => {
        user.username = 'lion_delta42';
        modelFunctions.testForValidModel(user);
    });

    it('Should trim a valid username', () => {

        user.username = '   magician.red_68     ';
        modelFunctions.testForValidModel(user);

        expect(user.username).to.equal('magician.red_68');

    });

});

describe('[db/models/user] - invalid email', () => {

    it('Should not validate a user without an email', () => {
        user.email = undefined;
        modelFunctions.testForInvalidModel(user, userDefinition.email.required);
    });

    it('Should not validate a user with an invalid email', () => {
        user.email = 'this-is@not-an@email.com';
        modelFunctions.testForInvalidModel(user, userDefinition.email.validate);
    });

});

describe('[db/models/user] - valid email', () => {

    it('Should validate a correct email', () => {
        user.email = 'john_smith@hotmail.com';
        modelFunctions.testForValidModel(user);
    });

    it('Should trim a valid email', () => {

        user.email = '   smith@something.org     ';
        modelFunctions.testForValidModel(user);

        expect(user.email).to.equal('smith@something.org');

    });

});

describe('[db/models/user] - invalid password', () => {

    const [passwordMinLength] = userDefinition.password.minlength;

    it('Should not validate a user without a password', () => {
        user.password = undefined;
        modelFunctions.testForInvalidModel(user, userDefinition.password.required);
    });

    it('Should not validate a user with a password that does not match the strongPassword regexp', () => {
        user.password = 'weak-shit';
        modelFunctions.testForInvalidModel(user, userDefinition.password.validate);
    });

    it(`Should not validate a user with a password shorter than ${ passwordMinLength } characters (unhashed)`, () => {
        user.password = '?sH1t.';
        modelFunctions.testForInvalidModel(user, userDefinition.password.minlength);
    });

});

describe('[db/models/user] - valid password', () => {

    it('Should validate a correct password', () => {
        user.password = 'Str0ng?P4s$w0rd!';
        modelFunctions.testForValidModel(user);
    });

});

describe('[db/models/user] - invalid avatar', () => {

    beforeEach(() => user.avatar = undefined);

    it('Should not validate a user avatar that does not match the imageExtension regexp', () => {

        user.avatar = {
            originalname: 'exam.docx',
            mimetype: 'image/jpeg'
        };

        modelFunctions.testForInvalidModel(user, userDefinition.avatar.validate);

    });

    it('Should not validate a user avatar that does not match the imageMimetype regexp', () => {

        user.avatar = {
            originalname: 'avatar.png',
            mimetype: 'application/xml'
        };

        modelFunctions.testForInvalidModel(user, userDefinition.avatar.validate);

    });

});

describe('[db/models/user] - valid avatar', () => {

    it('Should validate a correctly defined file schema', () => {
        modelFunctions.testForValidModel(user);
    });

    it('Should validate a user without a defined file schema', () => {
        user.avatar = undefined;
        modelFunctions.testForValidModel(user);
    });

});

describe('[db/models/user] - enabled', () => {

    it('Should set enabled flag to true as default upon user model instance creation', () => {
        expect(user.enabled).to.equal(true);
    });

});

describe('[db/models/user] - methods.getUserRoles', () => {

    let userAggregateStub;

    it('Should create a correct pipeline for the aggregate call', async () => {

        userAggregateStub = sinon.stub(user.model(userRole.modelName), 'aggregate').resolves([]);
        const roles = await user.getUserRoles();

        const wasCalledProperly = userAggregateStub.calledOnceWith(getRolesPipeline(user._id));
        expect(wasCalledProperly).to.equal(true);

        expect(roles.length).to.equal(0);

    });

    it('Should return an empty array on found user with no roles', async () => {

        userAggregateStub = sinon.stub(user.model(userRole.modelName), 'aggregate').resolves([]);
        const roles = await user.getUserRoles();

        expect(roles.length).to.equal(0);

    });

    it ('Should return an array of role names on found user with roles', async () => {

        userAggregateStub = sinon.stub(user.model(userRole.modelName), 'aggregate').resolves([
            {
                _id: user._id,
                roles: [
                    roleTypes.ROLE_ADMIN,
                    roleTypes.ROLE_PARENT
                ]
            }
        ]);

        const roles = await user.getUserRoles();

        expect(roles.length).to.equal(2);
        
        const [roleOne, roleTwo] = roles;

        expect(roleOne).to.equal(roleTypes.ROLE_ADMIN);
        expect(roleTwo).to.equal(roleTypes.ROLE_PARENT);

    });

    afterEach(() => {
        userAggregateStub.restore();
    });

});

describe('[db/models/user] - methods.hasRole', () => {

    let getUserRolesStub;

    it('Should return true on user that has a role', async () => {

        getUserRolesStub = sinon.stub(user, 'getUserRoles').resolves([roleTypes.ROLE_PARENT]);

        const hasRole = await user.hasRole(roleTypes.ROLE_PARENT);

        sinon.assert.calledOnce(getUserRolesStub);
        expect(hasRole).to.equal(true);

    });

    it('Should return false on user that does not have a role', async () => {

        getUserRolesStub = sinon.stub(user, 'getUserRoles').resolves([roleTypes.ROLE_TEACHER]);

        const hasRole = await user.hasRole(roleTypes.ROLE_STUDENT);

        sinon.assert.calledOnce(getUserRolesStub);
        expect(hasRole).to.equal(false);

    });

    afterEach(() => {
        getUserRolesStub.restore();
    });

});

describe('[db/models/user] - methods.saveAvatar', () => {

    let deleteBucketObjectsStub;
    let userSaveStub;
    let createMultipartObjectStub;

    const avatarDoc = sampleFiles.pngImage;
    const buffer = Buffer.alloc(10);

    it('Should throw error if user.avatar is defined but storageApi.deleteBucketObjects rejects (with correct arguments)', async () => {

        deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').rejects();
        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteBucketObjectsStub, bucketNames[userNames.modelName], [user.avatar.keyname]);

    });

    it('Should throw error if user.save fails (called once)', async () => {

        user.avatar = undefined;

        userSaveStub = sinon.stub(user, 'save').rejects();
        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(userSaveStub);

    });

    it('Should throw error and rollback avatar (user.save is called twice) if storageApi.createMultipartObject fails (with correct arguments)', async () => {

        user.avatar = undefined;

        userSaveStub = sinon.stub(user, 'save').resolvesThis();
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').rejects();

        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[userNames.modelName], sinon.match({
            keyname: sinon.match(regexp.fileKeyname),
            buffer,
            size: buffer.length,
            mimetype: avatarDoc.mimetype
        }));

        sinon.assert.calledTwice(userSaveStub);

    });

    it('Should resolve with updated user model if all required promises resolve', async () => {

        user.avatar = undefined;

        userSaveStub = sinon.stub(user, 'save').resolvesThis();
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.eql(user);

    });

    afterEach(() => {
        sinon.restore();
    })

});
