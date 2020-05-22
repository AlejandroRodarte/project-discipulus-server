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

const [homeworkStudentDoc] = fixtures.functions.util.generateOneToMany('homework', new Types.ObjectId(), [{ classStudent: new Types.ObjectId() }]);

let homeworkStudent = new db.models.HomeworkStudent(homeworkStudentDoc);

beforeEach(() => homeworkStudent = fixtures.functions.models.getNewModelInstance(db.models.HomeworkStudent, homeworkStudentDoc));

describe('[db/models/homework-student] - invalid class-student _id', () => {

    it('Should not validate if class-student _id is undefined', () => {
        homeworkStudent.classStudent = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.classStudent.required);
    });

});

describe('[db/models/homework-student] - invalid homework _id', () => {

    it('Should not validate if homework _id is undefined', () => {
        homeworkStudent.homework = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.homework.required);
    });

});

describe('[db/models/homework-student] - undefined student comments', () => {

    it('Should validate if student comments is undefined', () => {
        homeworkStudent.studentComments = undefined;
        fixtures.functions.models.testForValidModel(homeworkStudent);
    });

});

describe('[db/models/homework-student] - invalid student comments', function() {

    this.timeout(5000);

    const [homeworkStudentCommentsMaxLength] = db.schemas.definitions.homeworkStudentDefinition.studentComments.maxlength;

    it('Should not validate if homework student comments has bad words', () => {
        homeworkStudent.studentComments = 'You are pretty shit bruh';
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.studentComments.validate);
    });

    it(`Should not validate if homework student comments is longer than ${ homeworkStudentCommentsMaxLength } characters`, () => {
        homeworkStudent.studentComments = fixtures.util.lorem.generateWords(250);
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.studentComments.maxlength);
    });

});

describe('[db/models/homework-student] - valid student comments', () => {

    it('Should trim redundant spaced on valid homework student comments', () => {

        homeworkStudent.studentComments = '   Very   nice    Michael    ';
        fixtures.functions.models.testForValidModel(homeworkStudent);

        expect(homeworkStudent.studentComments).to.equal('Very nice Michael');

    });

});

describe('[db/models/homework-student] - default completed flag', () => {

    it('Should default completed flag to false', () => {
        expect(homeworkStudent.completed).to.equal(false);
    });

});

describe('[db/models/homework-student] - default direct grade', () => {

    it('Should default direct grade to 0', () => {
        expect(homeworkStudent.directGrade).to.equal(0);
    });

});

describe('[db/models/homework-student] - invalid direct grade', () => {

    const [homeworkStudentMinGrade] = db.schemas.definitions.homeworkStudentDefinition.directGrade.min;
    const [homeworkStudentMaxGrade] = db.schemas.definitions.homeworkStudentDefinition.directGrade.max;

    it(`Should not validate if homework direct grade is smaller than ${ homeworkStudentMinGrade }`, () => {
        homeworkStudent.directGrade = -1;
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.directGrade.min);
    });

    it(`Should not validate if homework direct grade is bigger than ${ homeworkStudentMaxGrade }`, () => {
        homeworkStudent.directGrade = 20000;
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.directGrade.max);
    });

});

describe('[db/models/homework-student] - undefined teacher comments', () => {

    it('Should validate if teacher comments is undefined', () => {
        homeworkStudent.teacherComments = undefined;
        fixtures.functions.models.testForValidModel(homeworkStudent);
    });

});

describe('[db/models/homework-student] - invalid teacher comments', function() {

    this.timeout(5000);

    const [homeworkStudentCommentsMaxLength] = db.schemas.definitions.homeworkStudentDefinition.teacherComments.maxlength;

    it('Should not validate if homework teacher comments has bad words', () => {
        homeworkStudent.teacherComments = 'This fuck aint no good man';
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.teacherComments.validate);
    });

    it(`Should not validate if homework teacher comments is longer than ${ homeworkStudentCommentsMaxLength } characters`, () => {
        homeworkStudent.teacherComments = fixtures.util.lorem.generateWords(250);
        fixtures.functions.models.testForInvalidModel(homeworkStudent, db.schemas.definitions.homeworkStudentDefinition.teacherComments.maxlength);
    });

});

describe('[db/models/homework-student] - valid teacher comments', () => {

    it('Should trim redundant spaced on valid homework teacher comments', () => {

        homeworkStudent.teacherComments = '    This   is    pure    garbage    ';
        fixtures.functions.models.testForValidModel(homeworkStudent);

        expect(homeworkStudent.teacherComments).to.equal('This is pure garbage');

    });

});

describe('[db/models/homework-student] - default published flag', () => {

    it('Should default published flag to false', () => {
        expect(homeworkStudent.published).to.equal(false);
    });

});
