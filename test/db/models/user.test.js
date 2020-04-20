const User = require('../../../src/db/models/user');

describe('Invalid user models', () => {

    test('Should not create a user without a name', () => {

        const userDoc = {};
        const user = new User(userDoc);

        const validationError = user.validateSync();

        expect(validationError).toBeDefined();

    });

    test('Should not create a user with an invalid name', () => {

        const userDoc = {
            name: 'Max+ User!'
        };

        const user = new User(userDoc);

        const validationError = user.validateSync();

        expect(validationError).toBeDefined();

    });

});
