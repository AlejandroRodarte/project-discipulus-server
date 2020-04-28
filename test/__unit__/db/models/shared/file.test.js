const expect = require('chai').expect;

const File = require('../../../../../src/db/models/shared/file');
const { sharedFileDefinition } = require('../../../../../src/db/schemas/shared/file');
const modelFunctions = require('../../../../__fixtures__/functions/models');

const sampleFileContext = require('../../../../__fixtures__/models/sample-file');

const names = require('../../../../../src/db/names');

const [fileDoc] = sampleFileContext.persisted[names.sharedFile.modelName];

let file = new File(fileDoc);

beforeEach(() => file = modelFunctions.getNewModelInstance(File, fileDoc));

describe('[db/models/shared/file] - invalid originalname', () => {

    const [originalnameMinLength] = sharedFileDefinition.originalname.minlength;
    const [originalnameMaxLength] = sharedFileDefinition.originalname.maxlength;

    it('Should not validate a file without an original filename', async () => {
        file.originalname = undefined;
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.originalname.required);
    });

    it('Should not validate a file that does not match the filename regexp pattern', async () => {
        file.originalname = ':bad_filename.csv';
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.originalname.validate);
    });

    it('Should not validate a file with a profane original filename', async () => {
        file.originalname = 'cock.gif';
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.originalname.validate);
    });

    it(`Should not validate a file with an original filename shorter than ${ originalnameMinLength } characters`, async () => {
        file.originalname = '.c';
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.originalname.minlength);
    });

    it(`Should not validate a file with an original filename longer than ${ originalnameMaxLength } characters`, async () => {
        file.originalname = `${[...Array(originalnameMaxLength + 1)].map(_ => 'a').join('')}.txt`;
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.originalname.maxlength);
    });

});

describe('[db/models/shared/file] - valid originalname', () => {

    it('Should validate a file with a correct originalname', async () => {
        file.originalname = 'my super exam document.txt';
        await modelFunctions.testForValidModelAsync(file);
    });

    it('Should trim a valid originalname', async () => {

        file.originalname = '    hey-man.csv     ';
        await modelFunctions.testForValidModelAsync(file);

        expect(file.originalname).to.equal('hey-man.csv');

    });

});

describe('[db/models/shared/file] - invalid mimetype', () => {

    it('Should not validate a file without a mimetype', async () => {
        file.mimetype = undefined;
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.mimetype.required);
    });

    it('Should not validate a file that does not match the mimeType regexp pattern', async () => {
        file.mimetype = 'image_jpeg';
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.mimetype.validate);
    });

});

describe('[db/models/shared/file] - valid mimetype', () => {

    it('Should validate a file with a correct mimetype', async () => {
        file.mimetype = 'audio/mp3';
        await modelFunctions.testForValidModelAsync(file);
    });

    it('Should trim a valid mimetype', async () => {

        file.mimetype = '    application/xml        ';
        await modelFunctions.testForValidModelAsync(file);

        expect(file.mimetype).to.equal('application/xml');

    });

});

describe('[db/models/shared/file] - keyname', () => {

    const [keynameMinLength] = sharedFileDefinition.keyname.minlength;
    const [keynameMaxLength] = sharedFileDefinition.keyname.maxlength;

    it('Should trigger pre validate hook and generate a unique file keyname, conserving the original extension', async () => {

        const validationError = await modelFunctions.validateAsync(file);

        const [originalName, originalNameExtension] = file.originalname.split('.');
        const [keyname, keynameExtension] = file.keyname.split('.');

        expect(validationError).to.be.null;

        expect(keynameExtension).to.equal(originalNameExtension);
        expect(keyname.length).to.equal(36);
        expect(originalName).to.not.equal(keyname);

    });

    it(`Should not validate a file with a keyname shorter than ${ keynameMinLength } characters`, async () => {
        file.keyname = 'bad-keyname.txt';
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.keyname.minlength);
    });

    it(`Should not validate a file with a keyname longer than ${ keynameMaxLength } characters`, async () => {
        file.originalname = 'some.superlongextensionnameman.with.somemore.c75bullshit.txt.whaaaat';
        await modelFunctions.testForInvalidModelAsync(file, sharedFileDefinition.keyname.maxlength);
    });

});
