const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

let user = new db.models.User(userDoc);

beforeEach(() => user = fixtures.functions.models.getNewModelInstance(db.models.User, userDoc));

describe('[db/models/user] - invalid name', () => {

    const [userMinLength] = db.schemas.definitions.userDefinition.name.minlength;
    const [userMaxLength] = db.schemas.definitions.userDefinition.name.maxlength;

    it('Should not validate a user without a name', () => {
        user.name = undefined;
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.name.required);
    });

    it('Should not validate a user with a name that does not match the fullName regexp pattern', () => {
        user.name = 'Max+ User!';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.name.validate);
    });

    it('Should not validate a user with a name that does not match the singleName regexp pattern', () => {
        user.name = '.Peter';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.name.validate);
    });

    it('Should not validate a user with an explicit profane name', () => {
        user.name = 'Pussy Destroyer';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.name.validate);
    });

    it(`Should not validate a user with a name shorter than ${ userMinLength } characters`, () => {
        user.name = 'A';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.name.minlength);
    });

    it(`Should not validate a user with a name longer than ${ userMaxLength } characters`, () => {
        user.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.name.maxlength);
    });

});

describe('[db/models/user] - valid name', () => {

    it('Should validate a correct user name', () => {
        user.name = 'Brian O\' Connor';
        fixtures.functions.models.testForValidModel(user);
    });

    it('Should trim a valid user name', () => {

        user.name = '   John        Smith    ';
        fixtures.functions.models.testForValidModel(user);

        expect(user.name).to.equal('John Smith');

    });

});

describe('[db/models/user] - invalid username', () => {

    const [usernameMinLength] = db.schemas.definitions.userDefinition.username.minlength;
    const [usernameMaxLength] = db.schemas.definitions.userDefinition.username.maxlength;

    it('Should not validate a user without a username', () => {
        user.username = undefined;
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.username.required);
    });

    it('Should not validate a user with a username that does not match the username regexp pattern', () => {
        user.username = 'max+!';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.username.validate);
    });

    it('Should not validate a user with a profane username', () => {
        user.username = 'anus';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.username.validate);
    });

    it(`Should not validate a user with a username shorter than ${ usernameMinLength } characters`, () => {
        user.username = 'cz';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.username.minlength);
    });

    it(`Should not validate a user with a username longer than ${ usernameMaxLength } characters`, () => {
        user.username = 'superlongusernamebruhohmygodsuperbadass';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.username.maxlength);
    });

});

describe('[db/models/user] - valid username', () => {

    it('Should validate a correct username', () => {
        user.username = 'lion_delta42';
        fixtures.functions.models.testForValidModel(user);
    });

    it('Should trim a valid username', () => {

        user.username = '   magician.red_68     ';
        fixtures.functions.models.testForValidModel(user);

        expect(user.username).to.equal('magician.red_68');

    });

});

describe('[db/models/user] - invalid email', () => {

    it('Should not validate a user without an email', () => {
        user.email = undefined;
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.email.required);
    });

    it('Should not validate a user with an invalid email', () => {
        user.email = 'this-is@not-an@email.com';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.email.validate);
    });

});

describe('[db/models/user] - valid email', () => {

    it('Should validate a correct email', () => {
        user.email = 'john_smith@hotmail.com';
        fixtures.functions.models.testForValidModel(user);
    });

    it('Should trim a valid email', () => {

        user.email = '   smith@something.org     ';
        fixtures.functions.models.testForValidModel(user);

        expect(user.email).to.equal('smith@something.org');

    });

});

describe('[db/models/user] - invalid password', () => {

    const [passwordMinLength] = db.schemas.definitions.userDefinition.password.minlength;

    it('Should not validate a user without a password', () => {
        user.password = undefined;
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.password.required);
    });

    it('Should not validate a user with a password that does not match the strongPassword regexp', () => {
        user.password = 'weak-shit';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.password.validate);
    });

    it(`Should not validate a user with a password shorter than ${ passwordMinLength } characters (unhashed)`, () => {
        user.password = '?sH1t.';
        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.password.minlength);
    });

});

describe('[db/models/user] - valid password', () => {

    it('Should validate a correct password', () => {
        user.password = 'Str0ng?P4s$w0rd!';
        fixtures.functions.models.testForValidModel(user);
    });

});

describe('[db/models/user] - invalid avatar', () => {

    beforeEach(() => user.avatar = undefined);

    it('Should not validate a user avatar that does not match the imageExtension regexp', () => {

        user.avatar = {
            originalname: 'exam.docx',
            mimetype: 'image/jpeg'
        };

        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.avatar.validate);

    });

    it('Should not validate a user avatar that does not match the imageMimetype regexp', () => {

        user.avatar = {
            originalname: 'avatar.png',
            mimetype: 'application/xml'
        };

        fixtures.functions.models.testForInvalidModel(user, db.schemas.definitions.userDefinition.avatar.validate);

    });

});

describe('[db/models/user] - valid avatar', () => {

    it('Should validate a correctly defined file schema', () => {
        fixtures.functions.models.testForValidModel(user);
    });

    it('Should validate a user without a defined file schema', () => {
        user.avatar = undefined;
        fixtures.functions.models.testForValidModel(user);
    });

});

describe('[db/models/user] - enabled', () => {

    it('Should set enabled flag to true as default upon user model instance creation', () => {
        expect(user.enabled).to.equal(true);
    });

});

describe('[db/models/user] - statics.findByIdAndValidateRole', () => {

    let userFindOneStub;
    let userHasRoleStub;

    const notFoundErrorMessage = 'User not found';
    const invalidRoleErrorMessage = 'Invalid role permission';

    const errorMessages = {
        notFoundErrorMessage,
        invalidRoleErrorMessage
    };

    const userId = new Types.ObjectId();

    it('Should throw error if User.findOne (called with correct args) resolves to null', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(null);

        await expect(db.models.User.findByIdAndValidateRole(userId, shared.roles.ROLE_PARENT, errorMessages)).to.eventually.be.rejectedWith(Error, notFoundErrorMessage);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: userId,
            enabled: true
        });

    });

    it('Should throw error if resolved user.hasRole returns false', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(false);

        await expect(db.models.User.findByIdAndValidateRole(userId, shared.roles.ROLE_PARENT, errorMessages)).to.eventually.be.rejectedWith(Error, invalidRoleErrorMessage);

        sinon.assert.calledOnceWithExactly(userHasRoleStub, shared.roles.ROLE_PARENT);

    });

    it('Should return user model instance if all promises resolve', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);

        await expect(db.models.User.findByIdAndValidateRole(userId, shared.roles.ROLE_PARENT, errorMessages)).to.eventually.eql(user);

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/user] - methods.getUserRoles', () => {

    let userAggregateStub;

    it('Should create a correct pipeline for the aggregate call', async () => {

        userAggregateStub = sinon.stub(user.model(shared.db.names.userRole.modelName), 'aggregate').resolves([]);
        const roles = await user.getUserRoles();

        const wasCalledProperly = userAggregateStub.calledOnceWith(shared.db.aggregation.userRolePipelines.getRolesPipeline(user._id));
        expect(wasCalledProperly).to.equal(true);

        expect(roles.length).to.equal(0);

    });

    it('Should return an empty array on found user with no roles', async () => {

        userAggregateStub = sinon.stub(user.model(shared.db.names.userRole.modelName), 'aggregate').resolves([]);
        const roles = await user.getUserRoles();

        expect(roles.length).to.equal(0);

    });

    it ('Should return an array of role names on found user with roles', async () => {

        userAggregateStub = sinon.stub(user.model(shared.db.names.userRole.modelName), 'aggregate').resolves([
            {
                _id: user._id,
                roles: [
                    shared.roles.ROLE_ADMIN,
                    shared.roles.ROLE_PARENT
                ]
            }
        ]);

        const roles = await user.getUserRoles();

        expect(roles.length).to.equal(2);
        
        const [roleOne, roleTwo] = roles;

        expect(roleOne).to.equal(shared.roles.ROLE_ADMIN);
        expect(roleTwo).to.equal(shared.roles.ROLE_PARENT);

    });

    afterEach(() => {
        userAggregateStub.restore();
    });

});

describe('[db/models/user] - methods.hasRole', () => {

    let getUserRolesStub;

    it('Should return true on user that has a role', async () => {

        getUserRolesStub = sinon.stub(user, 'getUserRoles').resolves([shared.roles.ROLE_PARENT]);

        const hasRole = await user.hasRole(shared.roles.ROLE_PARENT);

        sinon.assert.calledOnce(getUserRolesStub);
        expect(hasRole).to.equal(true);

    });

    it('Should return false on user that does not have a role', async () => {

        getUserRolesStub = sinon.stub(user, 'getUserRoles').resolves([shared.roles.ROLE_TEACHER]);

        const hasRole = await user.hasRole(shared.roles.ROLE_STUDENT);

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

    const avatarDoc = fixtures.shared.sampleFiles.pngImage;
    const buffer = Buffer.alloc(10);

    it('Should throw error if user.avatar is defined but storage.deleteBucketObjects rejects (with correct arguments)', async () => {

        deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').rejects();
        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteBucketObjectsStub, api.storage.config.bucketNames[shared.db.names.user.modelName], [user.avatar.keyname]);

    });

    it('Should throw error if user.save fails (called once)', async () => {

        user.avatar = undefined;

        userSaveStub = sinon.stub(user, 'save').rejects();
        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(userSaveStub);

    });

    it('Should throw error and rollback avatar (user.save is called twice) if storage.createMultipartObject fails (with correct arguments)', async () => {

        user.avatar = undefined;

        userSaveStub = sinon.stub(user, 'save').resolvesThis();
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').rejects();

        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.user.modelName], sinon.match({
            keyname: sinon.match(shared.regexp.fileKeyname),
            buffer,
            size: buffer.length,
            mimetype: avatarDoc.mimetype
        }));

        sinon.assert.calledTwice(userSaveStub);

    });

    it('Should resolve with updated user model if all required promises resolve', async () => {

        user.avatar = undefined;

        userSaveStub = sinon.stub(user, 'save').resolvesThis();
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(user.saveAvatar(avatarDoc, buffer)).to.eventually.be.eql(user);

    });

    afterEach(() => {
        sinon.restore();
    })

});
