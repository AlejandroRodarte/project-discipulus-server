const expect = require('chai').expect;

const db = require('../../../../../src/db');
const shared = require('../../../../../src/shared');
const fixtures = require('../../../../__fixtures__');

const [fileDoc] = fixtures.models.sampleFileContext.persisted[shared.db.names.sharedFile.modelName];

let file = new db.models.shared.File(fileDoc);

beforeEach(() => file = fixtures.functions.models.getNewModelInstance(db.models.shared.File, fileDoc));

describe('[db/models/shared/file] - invalid originalname', () => {

    const [originalnameMinLength] = db.schemas.shared.definitions.sharedFileDefinition.originalname.minlength;
    const [originalnameMaxLength] = db.schemas.shared.definitions.sharedFileDefinition.originalname.maxlength;

    it('Should not validate a file without an original filename', () => {
        file.originalname = undefined;
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.originalname.required);
    });

    it('Should not validate a file that does not match the filename regexp pattern', () => {
        file.originalname = ':bad_filename.csv';
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.originalname.validate);
    });

    it('Should not validate a file with a profane original filename', () => {
        file.originalname = 'cock.gif';
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.originalname.validate);
    });

    it(`Should not validate a file with an original filename shorter than ${ originalnameMinLength } characters`, () => {
        file.originalname = '.c';
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.originalname.minlength);
    });

    it(`Should not validate a file with an original filename longer than ${ originalnameMaxLength } characters`, () => {
        file.originalname = `${[...Array(originalnameMaxLength + 1)].map(_ => 'a').join('')}.txt`;
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.originalname.maxlength);
    });

});

describe('[db/models/shared/file] - valid originalname', () => {

    it('Should validate a file with a correct originalname', () => {
        file.originalname = 'my super exam document.txt';
        fixtures.functions.models.testForValidModel(file);
    });

    it('Should trim a valid originalname', () => {

        file.originalname = '    hey-man.csv     ';
        fixtures.functions.models.testForValidModel(file);

        expect(file.originalname).to.equal('hey-man.csv');

    });

});

describe('[db/models/shared/file] - invalid mimetype', () => {

    it('Should not validate a file without a mimetype', () => {
        file.mimetype = undefined;
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.mimetype.required);
    });

    it('Should not validate a file that does not match the mimeType regexp pattern', () => {
        file.mimetype = 'image_jpeg';
        fixtures.functions.models.testForInvalidModel(file, db.schemas.shared.definitions.sharedFileDefinition.mimetype.validate);
    });

});

describe('[db/models/shared/file] - valid mimetype', () => {

    it('Should validate a file with a correct mimetype', () => {
        file.mimetype = 'audio/mp3';
        fixtures.functions.models.testForValidModel(file);
    });

    it('Should trim a valid mimetype', () => {

        file.mimetype = '    application/xml        ';
        fixtures.functions.models.testForValidModel(file);

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
