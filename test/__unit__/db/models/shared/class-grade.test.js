const expect = require('chai').expect;

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const classGradeDoc = {
    homeworks: 10,
    projects: 30,
    exams: 60
};

let classGrade = new db.models.shared.ClassGrade(classGradeDoc);

beforeEach(() => classGrade = fixtures.functions.models.getNewModelInstance(db.models.shared.ClassGrade, classGradeDoc));

describe('[db/models/shared/class-grade] - Invalid homeworks grade', () => {

    const [homeworkMin] = db.schemas.shared.definitions.sharedClassGradeDefinition.homeworks.min;
    const [homeworkMax] = db.schemas.shared.definitions.sharedClassGradeDefinition.homeworks.max;

    it('Should not validate if homeworks grade is undefined', () => {
        classGrade.homeworks = undefined;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.homeworks.required);
    });

    it(`Should not validate if homeworks grade is lower than ${ homeworkMin }`, () => {
        classGrade.homeworks = -10;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.homeworks.min);
    });

    it(`Should not validate if homeworks grade is higher than ${ homeworkMax }`, () => {
        classGrade.homeworks = 150000;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.homeworks.max);
    });

});

describe('[db/models/shared/class-grade] - Invalid projects grade', () => {

    const [projectsMin] = db.schemas.shared.definitions.sharedClassGradeDefinition.projects.min;
    const [projectsMax] = db.schemas.shared.definitions.sharedClassGradeDefinition.projects.max;

    it('Should not validate if projects grade is undefined', () => {
        classGrade.projects = undefined;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.projects.required);
    });

    it(`Should not validate if projects grade is lower than ${ projectsMin }`, () => {
        classGrade.projects = -10;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.projects.min);
    });

    it(`Should not validate if projects grade is higher than ${ projectsMax }`, () => {
        classGrade.projects = 150000;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.projects.max);
    });

});

describe('[db/models/shared/class-grade] - Invalid exams grade', () => {

    const [examsMin] = db.schemas.shared.definitions.sharedClassGradeDefinition.exams.min;
    const [examsMax] = db.schemas.shared.definitions.sharedClassGradeDefinition.exams.max;

    it('Should not validate if exams grade is undefined', () => {
        classGrade.exams = undefined;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.exams.required);
    });

    it(`Should not validate if exams grade is lower than ${ examsMin }`, () => {
        classGrade.exams = -10;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.exams.min);
    });

    it(`Should not validate if exams grade is higher than ${ examsMax }`, () => {
        classGrade.exams = 150000;
        fixtures.functions.models.testForInvalidModel(classGrade, db.schemas.shared.definitions.sharedClassGradeDefinition.exams.max);
    });

});

describe('[db/models/shared/class-grade] - Valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(classGrade);
    });

});

describe('[db/models/shared/class-grade] - virtuals.finalGrade', () => {

    it('Should return sum of all class grades', () => {
        const finalGrade = Object.keys(classGradeDoc).reduce((acc, cv) => acc + classGradeDoc[cv], 0);
        expect(classGrade.finalGrade).to.equal(finalGrade);
    });

});
