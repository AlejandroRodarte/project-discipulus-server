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

const [homeworkStudentFileDoc] = fixtures.functions.util.generateOneToMany('homeworkStudent', new Types.ObjectId(), [{ file: fixtures.functions.models.generateFakeFile() }]);
let homeworkStudentFile = new db.models.HomeworkStudentFile(homeworkStudentFileDoc);

beforeEach(() => homeworkStudentFile = fixtures.functions.models.getNewModelInstance(db.models.HomeworkStudentFile, homeworkStudentFileDoc));

describe('[db/models/homework-student-file] - Invalid homeworkStudent _id', () => {

    it('Should not validate if homeworkStudent _id is undefined', () => {
        homeworkStudentFile.homeworkStudent = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudentFile, db.schemas.definitions.homeworkStudentFileDefinition.homeworkStudent.required);
    });

});

describe('[db/models/homework-student-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        homeworkStudentFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudentFile, db.schemas.definitions.homeworkStudentFileDefinition.file.required);
    });

});

describe('[db/models/homework-student-file] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(homeworkStudentFile);
    });

});