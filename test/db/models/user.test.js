const User = require('../../../src/db/models/user');

const { userDefinition } = require('../../../src/db/schemas/user');

describe('Invalid user models', () => {

    const [userMinLength] = userDefinition.name.minlength;
    const [userMaxLength] = userDefinition.name.maxlength;

    let userDoc;

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
                keyname: 'unique-identifier-filename.pdf'
            }
        };

    });

    test('Should not create a user without a name', () => {

        delete userDoc.name;

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not create a user with a name that has invalid characters', () => {

        userDoc.name = 'Max+ User!';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not create a user with a profane name', () => {

        userDoc.name = 'Max Fuck';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not create a user with a name shorter than ${ userMinLength } characters`, () => {

        userDoc.name = 'A';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not create a user with a name longer than ${ userMaxLength } characters`, () => {

        userDoc.name = 'Hey this is a reaaaaaaallllyyy looooong super name that should not enter into the database ever since its pretty long you now';

        const user = new User(userDoc);

        const validationError = user.validateSync();
        const [, validationMessage] = userDefinition.name.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});
