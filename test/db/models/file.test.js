const File = require('../../../src/db/models/file');

const { fileDefinition } = require('../../../src/db/schemas/file');

let fileDoc;

beforeEach(() => {

    fileDoc = {
        originalname: 'this is my file.pdf',
        mimetype: 'application/pdf',
        keyname: 'unique-identifier-filename.pdf'
    };

});

describe('Invalid file originalnames', () => {

    const [originalnameMinLength] = fileDefinition.originalname.minlength;
    const [originalnameMaxLength] = fileDefinition.originalname.maxlength;

    test('Should not validate a file without an original filename', () => {

        delete fileDoc.originalname;

        const file = new File(fileDoc);

        const validationError = file.validateSync();
        const [, validationMessage] = fileDefinition.originalname.required;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test('Should not validate a file with an invalid original filename', () => {

        fileDoc.originalname = ':bad_filename.csv';

        const file = new File(fileDoc);

        const validationError = file.validateSync();
        const [, validationMessage] = fileDefinition.originalname.validate;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a file with an original filename shorter than ${ originalnameMinLength } characters`, () => {

        fileDoc.originalname = '.c';

        const file = new File(fileDoc);

        const validationError = file.validateSync();
        const [, validationMessage] = fileDefinition.originalname.minlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

    test(`Should not validate a file with an original filename longer than ${ originalnameMaxLength } characters`, () => {

        fileDoc.originalname = `${[...Array(originalnameMaxLength + 1)].map(_ => 'a').join('')}.txt`;

        const file = new File(fileDoc);

        const validationError = file.validateSync();
        const [, validationMessage] = fileDefinition.originalname.maxlength;

        expect(validationError.message.includes(validationMessage)).toBe(true);

    });

});