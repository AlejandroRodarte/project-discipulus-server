const File = require('../../../../src/db/models/file');

const { fileDefinition } = require('../../../../src/db/schemas/file');

const modelFunctions = require('../../__fixtures__/functions/db/models');

const fileDoc = {
    originalname: 'this is my file.pdf',
    mimetype: 'application/pdf',
    keyname: '710b962e-041c-11e1-9234-0123456789ab.pdf'
};

let file = new File(fileDoc);

describe('Invalid file originalnames', () => {

    beforeEach(() => file = modelFunctions.getNewModelInstance(File, fileDoc));

    const [originalnameMinLength] = fileDefinition.originalname.minlength;
    const [originalnameMaxLength] = fileDefinition.originalname.maxlength;

    it('Should not validate a file without an original filename', () => {
        file.originalname = undefined;
        modelFunctions.testForInvalidModel(file, fileDefinition.originalname.required);
    });

    it('Should not validate a file that does not match the filename regexp pattern', () => {
        file.originalname = ':bad_filename.csv';
        modelFunctions.testForInvalidModel(file, fileDefinition.originalname.validate);
    });

    it('Should not validate a file with a profane original filename', () => {
        file.originalname = 'my-cock.gif';
        modelFunctions.testForInvalidModel(file, fileDefinition.originalname.validate);
    });

    it(`Should not validate a file with an original filename shorter than ${ originalnameMinLength } characters`, () => {
        file.originalname = '.c';
        modelFunctions.testForInvalidModel(file, fileDefinition.originalname.minlength);
    });

    it(`Should not validate a file with an original filename longer than ${ originalnameMaxLength } characters`, () => {
        file.originalname = `${[...Array(originalnameMaxLength + 1)].map(_ => 'a').join('')}.txt`;
        modelFunctions.testForInvalidModel(file, fileDefinition.originalname.maxlength);
    });

});

describe('Invalid file mimetypes', () => {

    beforeEach(() => file = modelFunctions.getNewModelInstance(File, fileDoc));

    it('Should not validate a file without a mimetype', () => {
        file.mimetype = undefined;
        modelFunctions.testForInvalidModel(file, fileDefinition.mimetype.required);
    });

    it('Should not validate a file that does not match the mimeType regexp pattern', () => {
        file.mimetype = 'image_jpeg';
        modelFunctions.testForInvalidModel(file, fileDefinition.mimetype.validate);
    });

});

describe('Invalid file keynames', () => {

    beforeEach(() => file = modelFunctions.getNewModelInstance(File, fileDoc));

    const [keynameMinLength] = fileDefinition.keyname.minlength;
    const [keynameMaxLength] = fileDefinition.keyname.maxlength;

    it('Should not validate a file without a keyname', () => {
        file.keyname = undefined;
        modelFunctions.testForInvalidModel(file, fileDefinition.keyname.required);
    });

    it('Should not validate a file with a keyname that does not match the filename regexp pattern', () => {
        file.keyname = '?super__wrong-name.csv';
        modelFunctions.testForInvalidModel(file, fileDefinition.keyname.validate);
    });

    it(`Should not validate a file with a keyname shorter than ${ keynameMinLength } characters`, () => {
        file.keyname = 'not-a-unique-keyname-0f4d.txt';
        modelFunctions.testForInvalidModel(file, fileDefinition.keyname.minlength);
    });

    it(`Should not validate a file with a keyname longer than ${ keynameMaxLength } characters`, () => {
        file.keyname = 'really-long-keyname-that-actually-does-not-match-with-the-uuid-package-710b962e-041c-11e1-9234-0123456789ab.mov';
        modelFunctions.testForInvalidModel(file, fileDefinition.keyname.maxlength);
    });

});