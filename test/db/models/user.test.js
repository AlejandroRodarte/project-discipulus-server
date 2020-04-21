const User = require('../../../src/db/models/user');

const { userDefinition } = require('../../../src/db/schemas/user');

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

        user.name = null;

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.required;
        
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a name that does not match the fullName regexp pattern', () => {

        user.name = 'Max+ User!';
    
        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a name that does not match the singleName regexp pattern', () => {

        user.name = '.Peter';
    
        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with an explicit profane name', () => {

        user.name = 'Pussy Destroyer';

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;
    
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with an implicit profane name', () => {

        user.name = 'Matthew Cumblast';

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;
    
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a name shorter than ${ userMinLength } characters`, () => {

        user.name = 'A';

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a name longer than ${ userMaxLength } characters`, () => {

        user.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Valid user names', () => {

    test('Should validate a correct user name', () => {

        user.name = 'Brian O\' Connor';

        const validationError = user.validateSync();
        expect(validationError).not.toBeDefined();

    });

    test('Should trim a valid user name', () => {

        user.name = '   John        Smith    ';

        const validationError = user.validateSync();

        expect(validationError).not.toBeDefined();
        expect(user.name).toBe('John Smith');

    });

});

describe('Invalid user usernames', () => {

    const [usernameMinLength] = userDefinition.username.minlength;
    const [usernameMaxLength] = userDefinition.username.maxlength;

    test('Should not validate a user without a username', () => {

        user.username = null;

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a username that does not match the username regexp pattern', () => {

        user.username = 'max+!';
    
        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a profane username', () => {

        user.username = 'colossalanus';
    
        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a username shorter than ${ usernameMinLength } characters`, () => {

        user.username = 'cz'

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a username longer than ${ usernameMaxLength } characters`, () => {

        user.username = 'superlongusernamebruh'

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Invalid user emails', () => {

    test('Should not validate a user without an email', () => {

        user.email = null;

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.email.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with an invalid email', () => {

        user.email = 'this-is@not-an@email.com';
    
        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.email.validate;
    
        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Invalid user passwords', () => {

    const [passwordMinLength] = userDefinition.password.minlength;
    const [passwordMaxLength] = userDefinition.password.maxlength;

    test('Should not validate a user without a password', () => {

        user.password = null;

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.password.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a password shorter than ${ passwordMinLength } characters (unhashed)`, () => {

        user.password = 'this-is-an-unhashed-password';

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.password.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a password longer than ${ passwordMaxLength } characters (unhashed)`, () => {

        user.password = 'really-long-password-that-is-not-actually-hashed-with-bcrypt-so-it-should-fail';

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.password.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});
