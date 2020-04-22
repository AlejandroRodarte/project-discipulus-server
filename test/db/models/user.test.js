const User = require('../../../src/db/models/user');

const { userDefinition } = require('../../../src/db/schemas/user');

const modelFunctions = require('../../__fixtures__/functions/models');

let userDoc;
let user;

beforeEach(() => {

    userDoc = {
        name: 'Alejandro Rodarte',
        username: 'rodarte8850',
        email: 'alejandrorodarte1@gmail.com',
        password: '$2y$08$uWMdVxKxs6tM72uzFM4cWOyJlpJNZPqHwwu0YMXQLgBvlMdjEo1wa',
        tokens: [
            'my-super-token'
        ],
        avatar: {
            originalname: 'this is my file.pdf',
            mimetype: 'application/pdf',
            keyname: '710b962e-041c-11e1-9234-0123456789ab.pdf'
        }
    };

    user = new User(userDoc);

});

describe('Invalid user names', () => {

    const [userMinLength] = userDefinition.name.minlength;
    const [userMaxLength] = userDefinition.name.maxlength;

    test('Should not validate a user without a name', () => {
        user.name = undefined;
        modelFunctions.testForInvalidModelField(user, userDefinition.name.required);
    });

    test('Should not validate a user with a name that does not match the fullName regexp pattern', () => {
        user.name = 'Max+ User!';
        modelFunctions.testForInvalidModelField(user, userDefinition.name.validate);
    });

    test('Should not validate a user with a name that does not match the singleName regexp pattern', () => {
        user.name = '.Peter';
        modelFunctions.testForInvalidModelField(user, userDefinition.name.validate);
    });

    test('Should not validate a user with an explicit profane name', () => {
        user.name = 'Pussy Destroyer';
        modelFunctions.testForInvalidModelField(user, userDefinition.name.validate);
    });

    test('Should not validate a user with an implicit profane name', () => {
        user.name = 'Matthew Cumblast';
        modelFunctions.testForInvalidModelField(user, userDefinition.name.validate);
    });

    test(`Should not validate a user with a name shorter than ${ userMinLength } characters`, () => {
        user.name = 'A';
        modelFunctions.testForInvalidModelField(user, userDefinition.name.minlength);
    });

    test(`Should not validate a user with a name longer than ${ userMaxLength } characters`, () => {
        user.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';
        modelFunctions.testForInvalidModelField(user, userDefinition.name.maxlength);
    });

});

describe('Valid user names', () => {

    test('Should validate a correct user name', () => {
        user.name = 'Brian O\' Connor';
        modelFunctions.testForValidModelField(user);
    });

    test('Should trim a valid user name', () => {

        user.name = '   John        Smith    ';
        modelFunctions.testForValidModelField(user);

        expect(user.name).toBe('John Smith');

    });

});

describe('Invalid user usernames', () => {

    const [usernameMinLength] = userDefinition.username.minlength;
    const [usernameMaxLength] = userDefinition.username.maxlength;

    test('Should not validate a user without a username', () => {
        user.username = undefined;
        modelFunctions.testForInvalidModelField(user, userDefinition.username.required);
    });

    test('Should not validate a user with a username that does not match the username regexp pattern', () => {
        user.username = 'max+!';
        modelFunctions.testForInvalidModelField(user, userDefinition.username.validate);
    });

    test('Should not validate a user with a profane username', () => {
        user.username = 'colossalanus';
        modelFunctions.testForInvalidModelField(user, userDefinition.username.validate);
    });

    test(`Should not validate a user with a username shorter than ${ usernameMinLength } characters`, () => {
        user.username = 'cz';
        modelFunctions.testForInvalidModelField(user, userDefinition.username.minlength);
    });

    test(`Should not validate a user with a username longer than ${ usernameMaxLength } characters`, () => {
        user.username = 'superlongusernamebruh';
        modelFunctions.testForInvalidModelField(user, userDefinition.username.maxlength);
    });

});

describe('Valid user usernames', () => {

    test('Should validate a correct username', () => {
        user.username = 'lion_delta42';
        modelFunctions.testForValidModelField(user);
    });

    test('Should trim a valid username', () => {

        user.username = '   magician.red_68     ';
        modelFunctions.testForValidModelField(user);

        expect(user.username).toBe('magician.red_68');

    });

});

describe('Invalid user emails', () => {

    test('Should not validate a user without an email', () => {
        user.email = undefined;
        modelFunctions.testForInvalidModelField(user, userDefinition.email.required);
    });

    test('Should not validate a user with an invalid email', () => {
        user.email = 'this-is@not-an@email.com';
        modelFunctions.testForInvalidModelField(user, userDefinition.email.validate);
    });

});

describe('Valid user emails', () => {

    test('Should validate a correct email', () => {
        user.email = 'john_smith@hotmail.com';
        modelFunctions.testForValidModelField(user);
    });

    test('Should trim a valid email', () => {

        user.email = '   smith@something.org     ';
        modelFunctions.testForValidModelField(user);

        expect(user.email).toBe('smith@something.org');

    });

});

describe('Invalid user passwords', () => {

    const [passwordMinLength] = userDefinition.password.minlength;
    const [passwordMaxLength] = userDefinition.password.maxlength;

    test('Should not validate a user without a password', () => {
        user.password = undefined;
        modelFunctions.testForInvalidModelField(user, userDefinition.password.required);
    });

    test(`Should not validate a user with a password shorter than ${ passwordMinLength } characters (unhashed)`, () => {
        user.password = 'this-is-an-unhashed-password';
        modelFunctions.testForInvalidModelField(user, userDefinition.password.minlength);
    });

    test(`Should not validate a user with a password longer than ${ passwordMaxLength } characters (unhashed)`, () => {
        user.password = 'really-long-password-that-is-not-actually-hashed-with-bcrypt-so-it-should-fail';
        modelFunctions.testForInvalidModelField(user, userDefinition.password.maxlength);
    });

});

describe('Valid user passwords', () => {

    test('Should validate a correct password', () => {
        user.password = '$2y$12$r2ey63ZhWsufGBHhnK8Y4uAxUQrGGdxOwETEa7NtVdZJCyWn6yrnW';
        modelFunctions.testForValidModelField(user);
    });

});

describe('User avatar', () => {

    test('Should validate a correctly defined file schema', () => {
        modelFunctions.testForValidModelField(user);
    });

    test('Should validate a user without a defined file schema', () => {
        user.avatar = undefined;
        modelFunctions.testForValidModelField(user);
    });

});
