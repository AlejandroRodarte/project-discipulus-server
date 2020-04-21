const regexp = require('../../src/util/regexp');

describe('roleName', () => {

    test('Should return false on invalid role names', () => {

        const names = [
            'MY_USER_ROLE',
            'ADMIN_ROLE',
            'SUPERVISOR'
        ];

        names.forEach(name => expect(regexp.roleName.test(name)).toBe(false));

    });

    test('Should return true on valid role names', () => {

        const names = [
            'ROLE_ADMIN',
            'ROLE_TEACER',
            'ROLE_STUDENT',
            'ROLE_PARENT'
        ];

        names.forEach(name => expect(regexp.roleName.test(name)).toBe(true));

    });

});

describe('singleName', () => {
    
    test('Should return false on invalid single names', () => {

        const names = [
            '?John',
            '_Peter',
            '.Johan'
        ];

        names.forEach(name => expect(regexp.singleName.test(name)).toBe(false));

    });

    test('Should return true on valid single names', () => {

        const names = [
            'Alex',
            'Frederik',
            'Gómez',
            'Ramírez'
        ];

        names.forEach(name => expect(regexp.singleName.test(name)).toBe(true));

    });

});

describe('fullName', () => {
    
    test('Should return false on invalid full names', () => {

        const names = [
            'Max+ User!',
            '__Matt Damon',
            '-George Ramirez',
            '.Unknown'
        ];

        names.forEach(name => expect(regexp.fullName.test(name)).toBe(false));

    });

    test('Should return true on valid full names', () => {

        const names = [
            'John Doe',
            'María Pérez',
            'Brian O\' Connor',
            'Shaquille O’ Neal'
        ];

        names.forEach(name => expect(regexp.fullName.test(name)).toBe(true));

    });

});

describe('username', () => {
    
    test('Should return false on invalid usernames', () => {

        const usernames = [
            '__monster!',
            '.hidden',
            'max+!',
            'your-name'
        ];

        usernames.forEach(username => expect(regexp.username.test(username)).toBe(false));

    });

    test('Should return true on valid usernames', () => {

        const usernames = [
            'gyrfalke42',
            'demon36',
            'assassin_pro',
            'unknown.bro'
        ];

        usernames.forEach(username => expect(regexp.username.test(username)).toBe(true));

    });

});

describe('mimeType', () => {
    
    test('Should return false on invalid mimetypes', () => {

        const mimetypes = [
            'application-json',
            'image_jpeg',
            'video//mp4',
            'imege__png'
        ];

        mimetypes.forEach(mimetype => expect(regexp.mimeType.test(mimetype)).toBe(false));

    });

    test('Should return true on valid mimetypes', () => {

        const mimetypes = [
            'application/xml',
            'text/html',
            'audio/x-wav',
            'image/gif'
        ];

        mimetypes.forEach(mimetype => expect(regexp.mimeType.test(mimetype)).toBe(true));

    });

});

describe('filename', () => {
    
    test('Should return false on invalid filenames', () => {

        const filenames = [
            '+file.png',
            'a`weird-name.jpeg',
            '{what__the?.mov',
            ']super-not.cool'
        ];

        filenames.forEach(filename => expect(regexp.filename.test(filename)).toBe(false));

    });

    test('Should return true on valid filenames', () => {

        const filenames = [
            '.env.test',
            'my file.pdf',
            'word-document.docx',
            '_config.txt',
            '0bd6-4cf3.png'
        ];

        filenames.forEach(filename => expect(regexp.filename.test(filename)).toBe(true));

    });

});
