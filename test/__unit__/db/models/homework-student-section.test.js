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

const [homeworkStudentSectionDoc] = fixtures.functions.util.generateOneToMany('homeworkStudent', new Types.ObjectId(), [{ homeworkSection: new Types.ObjectId() }]);

let homeworkStudentSection = new db.models.HomeworkStudentSection(homeworkStudentSectionDoc);

beforeEach(() => homeworkStudentSection = fixtures.functions.models.getNewModelInstance(db.models.HomeworkStudentSection, homeworkStudentSectionDoc));

describe('[db/models/homework-student-section] - Invalid homeworkStudent _id', () => {

    it('Should not validate if homeworkStudent _id is undefined', () => {
        homeworkStudentSection.homeworkStudent = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudentSection, db.schemas.definitions.homeworkStudentSectionDefinition.homeworkStudent.required);
    });

});

describe('[db/models/homework-student-section] - Invalid homeworkSection _id', () => {

    it('Should not validate if homeworkSection _id is undefined', () => {
        homeworkStudentSection.homeworkSection = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudentSection, db.schemas.definitions.homeworkStudentSectionDefinition.homeworkSection.required);
    });

});

describe('[db/models/homework-student-section] - default points', () => {

    it('Should default points to 0', () => {
        expect(homeworkStudentSection.points).to.equal(0);
    });

});

describe('[db/models/homework-student-section] - invalid points', () => {

    const [homeworkStudentSectionMinPoints] = db.schemas.definitions.homeworkStudentSectionDefinition.points.min;
    const [homeworkStudentSectionMaxPoints] = db.schemas.definitions.homeworkStudentSectionDefinition.points.max;

    it(`Should not validate if homework points is smaller than ${ homeworkStudentSectionMinPoints }`, () => {
        homeworkStudentSection.points = -1;
        fixtures.functions.models.testForInvalidModel(homeworkStudentSection, db.schemas.definitions.homeworkStudentSectionDefinition.points.min);
    });

    it(`Should not validate if homework points is bigger than ${ homeworkStudentSectionMaxPoints }`, () => {
        homeworkStudentSection.points = 20000;
        fixtures.functions.models.testForInvalidModel(homeworkStudentSection, db.schemas.definitions.homeworkStudentSectionDefinition.points.max);
    });

});
