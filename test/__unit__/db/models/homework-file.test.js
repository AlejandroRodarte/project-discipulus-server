const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [homeworkFileDoc] = fixtures.functions.util.generateOneToMany('homework', new Types.ObjectId(), [{ file: fixtures.functions.models.generateFakeFile() }]);
let homeworkFile = new db.models.HomeworkFile(homeworkFileDoc);

beforeEach(() => homeworkFile = fixtures.functions.models.getNewModelInstance(db.models.HomeworkFile, homeworkFileDoc));

describe('[db/models/homework-file] - Invalid homework _id', () => {

    it('Should not validate if homework _id is undefined', () => {
        homeworkFile.homework = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkFile, db.schemas.definitions.homeworkFileDefinition.homework.required);
    });

});

describe('[db/models/homework-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        homeworkFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkFile, db.schemas.definitions.homeworkFileDefinition.file.required);
    });

});

describe('[db/models/homework-file] - Default published flag', () => {

    it('Should default published flag to false', () => {
        expect(homeworkFile.published).to.equal(false);
    });

});

describe('[db/models/homework-file] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(homeworkFile);
    });

});
