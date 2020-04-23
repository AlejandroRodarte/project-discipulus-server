const expect = require('chai').expect;

const File = require('../../../../src/db/models/file');
const { fileDefinition } = require('../../../../src/db/schemas/file');
const modelFunctions = require('../../../__fixtures__/functions/models');

const fileDoc = {
    originalname: 'this is my file.pdf',
    mimetype: 'application/pdf'
};

let file = new File(fileDoc);

const validate = (model) => new Promise(resolve => model.validate(resolve));

beforeEach(() => file = modelFunctions.getNewModelInstance(File, fileDoc));

describe('[db/models/file] - invalid originalname', () => {

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
        file.originalname = 'cock.gif';
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

describe('[db/models/file] - valid originalname', () => {

    it('Should validate a file with a correct originalname', () => {
        file.originalname = 'my super exam document.txt';
        modelFunctions.testForValidModel(file);
    });

    it('Should trim a valid originalname', () => {

        file.originalname = '    hey-man.csv     ';
        modelFunctions.testForValidModel(file);

        expect(file.originalname).to.equal('hey-man.csv');

    });

});

describe('[db/models/file] - invalid mimetype', () => {

    it('Should not validate a file without a mimetype', () => {
        file.mimetype = undefined;
        modelFunctions.testForInvalidModel(file, fileDefinition.mimetype.required);
    });

    it('Should not validate a file that does not match the mimetype regexp pattern', () => {
        file.mimetype = 'image_jpeg';
        modelFunctions.testForInvalidModel(file, fileDefinition.mimetype.validate);
    });

});

describe('[db/models/file] - valid mimetype', () => {

    it('Should validate a file with a correct mimetype', () => {
        file.mimetype = 'audio/mp3';
        modelFunctions.testForValidModel(file);
    });

    it('Should trim a valid mimetype', () => {

        file.mimetype = '    application/xml        ';
        modelFunctions.testForValidModel(file);

        expect(file.mimetype).to.equal('application/xml');

    });

});

describe('[db/models/file] - keyname', () => {

    const [keynameMinLength] = fileDefinition.keyname.minlength;
    const [keynameMaxLength] = fileDefinition.keyname.maxlength;

    it('Should trigger pre validate hook and generate a unique file keyname, conserving the original extension', async () => {

        const validationError = await validate(file);

        const [originalName, originalNameExtension] = file.originalname.split('.');
        const [keyname, keynameExtension] = file.keyname.split('.');

        expect(validationError).to.be.null;

        expect(keynameExtension).to.equal(originalNameExtension);
        expect(keyname.length).to.equal(36);
        expect(originalName).to.not.equal(keyname);

    });

    // it('Should not validate a file without a keyname', () => {
    //     file.keyname = undefined;
    //     modelFunctions.testForInvalidModel(file, fileDefinition.keyname.required);
    // });

    // it('Should not validate a file with a keyname that does not match the filename regexp pattern', () => {
    //     file.keyname = '?super__wrong-name.csv';
    //     modelFunctions.testForInvalidModel(file, fileDefinition.keyname.validate);
    // });

    // it(`Should not validate a file with a keyname shorter than ${ keynameMinLength } characters`, () => {
    //     file.keyname = 'not-a-unique-keyname-0f4d.txt';
    //     modelFunctions.testForInvalidModel(file, fileDefinition.keyname.minlength);
    // });

    // it(`Should not validate a file with a keyname longer than ${ keynameMaxLength } characters`, () => {
    //     file.keyname = 'really-long-keyname-that-actually-does-not-match-with-the-uuid-package-710b962e-041c-11e1-9234-0123456789ab.mov';
    //     modelFunctions.testForInvalidModel(file, fileDefinition.keyname.maxlength);
    // });

});

describe('[db/models/file] - valid keyname', () => {

    it('Should validate a file with a correct keyname', () => {
        file.keyname = 'e8b5a51d-11c8-3310-a6ab-367563f20686.torrent';
        modelFunctions.testForValidModel(file);
    });

    it('Should trim a valid keyname', () => {

        file.keyname = '      9f282611-e0fd-5650-8953-89c8e342da0b.mp4      ';
        modelFunctions.testForValidModel(file);

        expect(file.keyname).to.equal('9f282611-e0fd-5650-8953-89c8e342da0b.mp4');

    });

});
