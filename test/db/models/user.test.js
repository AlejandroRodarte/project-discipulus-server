const User = require('../../../src/db/models/user');

const { userDefinition } = require('../../../src/db/schemas/user');

let userDoc;
let user = new User();

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

        delete userDoc.name;

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a name that has invalid characters', () => {

        const names = [
            'Max+ User!',
            '__Matt Damon',
            '-George Ramirez',
            '.Unknown'
        ];

        names.forEach(name => {

            user.name = name;
    
            const validationError = user.validateSync();
            const [, validationMessage] = userDefinition.name.validate;
    
            expect(validationError.message.includes(validationMessage)).toBe(true);

        });

    });

    test('Should not validate a user with a profane name', () => {

        userDoc.name = 'Max Fuck';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a name shorter than ${ userMinLength } characters`, () => {

        userDoc.name = 'A';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a name longer than ${ userMaxLength } characters`, () => {

        userDoc.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Invalid user usernames', () => {

    const [usernameMinLength] = userDefinition.username.minlength;
    const [usernameMaxLength] = userDefinition.username.maxlength;

    test('Should not validate a user without a username', () => {

        delete userDoc.username;

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a username that contains invalid characters', () => {

        userDoc.username = '__monster!'

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with a profane username', () => {

        userDoc.username = 'pussydestroyer'

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a username shorter than ${ usernameMinLength } characters`, () => {

        userDoc.username = 'cz'

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a username longer than ${ usernameMaxLength } characters`, () => {

        userDoc.username = 'superlongusernamebruh'

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.username.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Invalid user emails', () => {

    test('Should not validate a user without an email', () => {

        delete userDoc.email;

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.email.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a user with an invalid email', () => {

        userDoc.email = 'this-is@not-an@email.com';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.email.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});

describe('Invalid user passwords', () => {

    const [passwordMinLength] = userDefinition.password.minlength;
    const [passwordMaxLength] = userDefinition.password.maxlength;

    test('Should not validate a user without a password', () => {

        delete userDoc.password;

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.password.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a password shorter than ${ passwordMinLength } characters (unhashed)`, () => {

        userDoc.password = 'this-is-an-unhashed-password';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.password.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a user with a password longer than ${ passwordMaxLength } characters (unhashed)`, () => {

        userDoc.password = 'really-long-password-that-is-not-actually-hashed-with-bcrypt-so-it-should-fail';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.password.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});
