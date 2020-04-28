const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../../../../src/db/models/user');
const { userDefinition } = require('../../../../src/db/schemas/user');
const modelFunctions = require('../../../__fixtures__/functions/models');

const sampleFileContext = require('../../../__fixtures__/models/sample-file');

const { getRolesPipeline } = require('../../../../src/db/aggregation/user-role');

const { sharedFile, userRole } = require('../../../../src/db/names');
const roleTypes = require('../../../../src/util/roles');

const [fileDoc] = sampleFileContext.persisted[sharedFile.modelName];

const userDoc = {
    name: 'Alejandro Rodarte',
    username: 'rodarte8850',
    email: 'alejandrorodarte1@gmail.com',
    password: 'Sup3rpa$Sword!-',
    tokens: [
        'my-super-token'
    ],
    avatar: fileDoc
};

let user = new User(userDoc);

beforeEach(() => user = modelFunctions.getNewModelInstance(User, userDoc));

describe('[db/models/user] - invalid name', () => {

    const [userMinLength] = userDefinition.name.minlength;
    const [userMaxLength] = userDefinition.name.maxlength;

    it('Should not validate a user without a name', async () => {
        user.name = undefined;
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.name.required);
    });

    it('Should not validate a user with a name that does not match the fullName regexp pattern', async () => {
        user.name = 'Max+ User!';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.name.validate);
    });

    it('Should not validate a user with a name that does not match the singleName regexp pattern', async () => {
        user.name = '.Peter';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.name.validate);
    });

    it('Should not validate a user with an explicit profane name', async () => {
        user.name = 'Pussy Destroyer';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.name.validate);
    });

    it(`Should not validate a user with a name shorter than ${ userMinLength } characters`, async () => {
        user.name = 'A';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.name.minlength);
    });

    it(`Should not validate a user with a name longer than ${ userMaxLength } characters`, async () => {
        user.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.name.maxlength);
    });

});

describe('[db/models/user] - valid name', () => {

    it('Should validate a correct user name', async () => {
        user.name = 'Brian O\' Connor';
        await modelFunctions.testForValidModelAsync(user);
    });

    it('Should trim a valid user name', async () => {

        user.name = '   John        Smith    ';
        await modelFunctions.testForValidModelAsync(user);

        expect(user.name).to.equal('John Smith');

    });

});

describe('[db/models/user] - invalid username', () => {

    const [usernameMinLength] = userDefinition.username.minlength;
    const [usernameMaxLength] = userDefinition.username.maxlength;

    it('Should not validate a user without a username', async () => {
        user.username = undefined;
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.username.required);
    });

    it('Should not validate a user with a username that does not match the username regexp pattern', async () => {
        user.username = 'max+!';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.username.validate);
    });

    it('Should not validate a user with a profane username', async () => {
        user.username = 'anus';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.username.validate);
    });

    it(`Should not validate a user with a username shorter than ${ usernameMinLength } characters`, async () => {
        user.username = 'cz';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.username.minlength);
    });

    it(`Should not validate a user with a username longer than ${ usernameMaxLength } characters`, async () => {
        user.username = 'superlongusernamebruhohmygodsuperbadass';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.username.maxlength);
    });

});

describe('[db/models/user] - valid username', () => {

    it('Should validate a correct username', async () => {
        user.username = 'lion_delta42';
        await modelFunctions.testForValidModelAsync(user);
    });

    it('Should trim a valid username', async () => {

        user.username = '   magician.red_68     ';
        await modelFunctions.testForValidModelAsync(user);

        expect(user.username).to.equal('magician.red_68');

    });

});

describe('[db/models/user] - invalid email', () => {

    it('Should not validate a user without an email', async () => {
        user.email = undefined;
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.email.required);
    });

    it('Should not validate a user with an invalid email', async () => {
        user.email = 'this-is@not-an@email.com';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.email.validate);
    });

});

describe('[db/models/user] - valid email', () => {

    it('Should validate a correct email', async () => {
        user.email = 'john_smith@hotmail.com';
        await modelFunctions.testForValidModelAsync(user);
    });

    it('Should trim a valid email', async () => {

        user.email = '   smith@something.org     ';
        await modelFunctions.testForValidModelAsync(user);

        expect(user.email).to.equal('smith@something.org');

    });

});

describe('[db/models/user] - invalid password', () => {

    const [passwordMinLength] = userDefinition.password.minlength;

    it('Should not validate a user without a password', async () => {
        user.password = undefined;
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.password.required);
    });

    it('Should not validate a user with a password that does not match the strongPassword regexp', async () => {
        user.password = 'weak-shit';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.password.validate);
    });

    it(`Should not validate a user with a password shorter than ${ passwordMinLength } characters (unhashed)`, async () => {
        user.password = '?sH1t.';
        await modelFunctions.testForInvalidModelAsync(user, userDefinition.password.minlength);
    });

});

describe('[db/models/user] - valid password', () => {

    it('Should validate a correct password', async () => {
        user.password = 'Str0ng?P4s$w0rd!';
        await modelFunctions.testForValidModelAsync(user);
    });

});

describe('[db/models/user] - avatar', () => {

    it('Should validate a correctly defined file schema', async () => {
        await modelFunctions.testForValidModelAsync(user);
    });

    it('Should validate a user without a defined file schema', async () => {
        user.avatar = undefined;
        await modelFunctions.testForValidModelAsync(user);
    });

});

describe('[db/models/user] - enabled', () => {

    it('Should set enabled flag to true as default upon user model instance creation', async () => {
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
