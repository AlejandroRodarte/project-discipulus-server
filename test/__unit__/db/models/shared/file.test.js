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

    it('Should not validate a file without an original filename', () => {
        file.originalname = undefined;
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.originalname.required);
    });

    it('Should not validate a file that does not match the filename regexp pattern', () => {
        file.originalname = ':bad_filename.csv';
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.originalname.validate);
    });

    it('Should not validate a file with a profane original filename', () => {
        file.originalname = 'cock.gif';
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.originalname.validate);
    });

    it(`Should not validate a file with an original filename shorter than ${ originalnameMinLength } characters`, () => {
        file.originalname = '.c';
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.originalname.minlength);
    });

    it(`Should not validate a file with an original filename longer than ${ originalnameMaxLength } characters`, () => {
        file.originalname = `${[...Array(originalnameMaxLength + 1)].map(_ => 'a').join('')}.txt`;
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.originalname.maxlength);
    });

});

describe('[db/models/shared/file] - valid originalname', () => {

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

describe('[db/models/shared/file] - invalid mimetype', () => {

    it('Should not validate a file without a mimetype', () => {
        file.mimetype = undefined;
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.mimetype.required);
    });

    it('Should not validate a file that does not match the mimeType regexp pattern', () => {
        file.mimetype = 'image_jpeg';
        modelFunctions.testForInvalidModel(file, sharedFileDefinition.mimetype.validate);
    });

});

describe('[db/models/shared/file] - valid mimetype', () => {

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

describe('[db/models/shared/file] - virtuals.keyname', () => {

    it('Should populate keyname virtual field', () => {

        const [, ...extensions] = file.originalname.split('.');
        const keyname = `${file._id.toHexString()}.${extensions.join('.')}`;

        expect(file.keyname).to.equal(keyname);

    });

});
