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

const homeworkDoc = {
    class: new Types.ObjectId(),
    title: 'Hard stuff',
    description: 'You will suffer',
    type: shared.db.models.class.gradeType.NO_SECTIONS,
    grade: 10
};

let homework = new db.models.Homework(homeworkDoc);

beforeEach(() => homework = fixtures.functions.models.getNewModelInstance(db.models.Homework, homeworkDoc));

describe('[db/models/homework] - invalid class _id', () => {

    it('Should not validate if class _id is undefined', () => {
        homework.class = undefined;
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.class.required);
    });

});

describe('[db/models/homework] - invalid title', () => {

    const [homeworkTitleMinLength] = db.schemas.definitions.homeworkDefinition.title.minlength;
    const [homeworkTitleMaxLength] = db.schemas.definitions.homeworkDefinition.title.maxlength;

    it('Should not validate if homework title is undefined', () => {
        homework.title = undefined;
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.title.required);
    });

    it('Should not validate if homework title has bad words', () => {
        homework.title = 'Fuck shit up';
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.title.validate);
    });

    it(`Should not validate if homework title is shorter than ${ homeworkTitleMinLength } characters`, () => {
        homework.title = 'Do';
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.title.minlength);
    });

    it(`Should not validate if homework title is longer than ${ homeworkTitleMaxLength } characters`, () => {
        homework.title = fixtures.util.lorem.generateWords(30);
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.title.maxlength);
    });

});

describe('[db/models/homework] - valid title', () => {

    it('Should trim redundant spaces on valid homework title', () => {

        homework.title = '    Gotta  do  it   ';
        fixtures.functions.models.testForValidModel(homework);

        expect(homework.title).to.equal('Gotta do it');

    });

});

describe('[db/models/homework] - undefined description', () => {

    it('Should validate homework if description is undefined', () => {
        homework.description = undefined;
        fixtures.functions.models.testForValidModel(homework);
    });

});

describe('[db/models/homework] - invalid description', () => {

    const [homeworkDescriptionMaxLength] = db.schemas.definitions.homeworkDefinition.description.maxlength;

    it('Should not validate if homework description has bad words', () => {
        homework.description = 'Gotta go for some bitch';
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.description.validate);
    });

    it(`Should not validate if homework description is longer than ${ homeworkDescriptionMaxLength } characters`, () => {
        homework.description = fixtures.util.lorem.generateWords(130);
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.description.maxlength);
    });

});

describe('[db/models/homework] - valid description', () => {

    it('Should trim redundant spaces on valid homework description', () => {

        homework.description = '     You   will   super   ';
        fixtures.functions.models.testForValidModel(homework);

        expect(homework.description).to.equal('You will super');

    });

});

describe('[db/models/homework] - invalid type', () => {

    const validationArr = [null, db.schemas.definitions.homeworkDefinition.type.enum.message];

    it('Should not validate if homework type is not included in enum', () => {
        homework.type = 'UNKNOWN';
        fixtures.functions.models.testForInvalidModel(homework, validationArr);
    });

});

describe('[db/models/homework] - valid type', () => {

    it('Should set previous type properly', () => {
        homework.type = shared.db.models.class.gradeType.SECTIONS;
        expect(homework._previousType).to.equal(shared.db.models.class.gradeType.NO_SECTIONS);
    });

});

describe('[db/models/homework] - invalid grade', () => {

    const [homeworkMinGrade] = db.schemas.definitions.homeworkDefinition.grade.min;
    const [homeworkMaxGrade] = db.schemas.definitions.homeworkDefinition.grade.max;

    it('Should not validate if homework grade is undefined', () => {
        homework.grade = undefined;
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.grade.required);
    });

    it(`Should not validate if homework grade is smaller than ${ homeworkMinGrade }`, () => {
        homework.grade = 0;
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.grade.min);
    });

    it(`Should not validate if homework grade is bigger than ${ homeworkMaxGrade }`, () => {
        homework.grade = 20000;
        fixtures.functions.models.testForInvalidModel(homework, db.schemas.definitions.homeworkDefinition.grade.max);
    });

});

describe('[db/models/homework] - default time range', () => {

    it('Should provide a default time range if not specified (just start time)', () => {
        expect(homework.timeRange.start).to.be.a('number');
        expect(homework.timeRange.end).to.be.undefined;
    });

});

describe('[db/models/homework] - default published flag', () => {

    it('Should provide a default published flag of false', () => {
        expect(homework.published).to.equal(false);
    });

});

describe('[db/models/homework] - valid model', () => {

    it('Should validate proper model', () => {
        fixtures.functions.models.testForValidModel(homework);
    });

});
