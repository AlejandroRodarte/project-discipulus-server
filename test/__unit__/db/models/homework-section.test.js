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

const [homeworkSectionDoc] = fixtures.functions.util.generateOneToMany('homework', new Types.ObjectId(), [ fixtures.functions.models.generateFakeHomeworkSection({ points: 10 }) ]);
let homeworkSection = new db.models.HomeworkSection(homeworkSectionDoc);

beforeEach(() => homeworkSection = fixtures.functions.models.getNewModelInstance(db.models.HomeworkSection, homeworkSectionDoc));

describe('[db/models/homework-section] - Invalid homework _id', () => {

    it('Should not validate if homework _id is undefined', () => {
        homeworkSection.homework = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.homework.required);
    });

});

describe('[db/models/homework-section] - invalid title', () => {

    const [homeworkSectionTitleMinLength] = db.schemas.definitions.homeworkSectionDefinition.title.minlength;
    const [homeworkSectionTitleMaxLength] = db.schemas.definitions.homeworkSectionDefinition.title.maxlength;

    it('Should not validate if homework section title is undefined', () => {
        homeworkSection.title = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.title.required);
    });

    it('Should not validate if homework section title has bad words', () => {
        homeworkSection.title = 'Ass whoopin';
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.title.validate);
    });

    it(`Should not validate if homework section title is shorter than ${ homeworkSectionTitleMinLength } characters`, () => {
        homeworkSection.title = 'He';
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.title.minlength);
    });

    it(`Should not validate if homework section title is longer than ${ homeworkSectionTitleMaxLength } characters`, () => {
        homeworkSection.title = fixtures.util.lorem.generateWords(30);
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.title.maxlength);
    });

});

describe('[db/models/homework-section] - valid title', () => {

    it('Should trim redundant spaces on valid homework section title', () => {

        homeworkSection.title = '    No  bad   words   ';
        fixtures.functions.models.testForValidModel(homeworkSection);

        expect(homeworkSection.title).to.equal('No bad words');

    });

});

describe('[db/models/homework-section] - undefined description', () => {

    it('Should validate homework if description is undefined', () => {
        homeworkSection.description = undefined;
        fixtures.functions.models.testForValidModel(homeworkSection);
    });

});

describe('[db/models/homework-section] - invalid description', () => {

    const [homeworkSectionDescriptionMaxLength] = db.schemas.definitions.homeworkSectionDefinition.description.maxlength;

    it('Should not validate if homework section description has bad words', () => {
        homeworkSection.description = 'You better check this shit good';
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.description.validate);
    });

    it(`Should not validate if homework section description is longer than ${ homeworkSectionDescriptionMaxLength } characters`, () => {
        homeworkSection.description = fixtures.util.lorem.generateWords(130);
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.description.maxlength);
    });

});

describe('[db/models/homework-section] - valid description', () => {

    it('Should trim redundant spaces on valid homework section description', () => {

        homeworkSection.description = '       Ponderated  cool   ';
        fixtures.functions.models.testForValidModel(homeworkSection);

        expect(homeworkSection.description).to.equal('Ponderated cool');

    });

});

describe('[db/models/homework-section] - invalid points', () => {

    const [homeworkSectionMinPoints] = db.schemas.definitions.homeworkSectionDefinition.points.min;
    const [homeworkSectionMaxPoints] = db.schemas.definitions.homeworkSectionDefinition.points.max;

    it('Should not validate if homework points is undefined', () => {
        homeworkSection.points = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.points.required);
    });

    it(`Should not validate if homework points is smaller than ${ homeworkSectionMinPoints }`, () => {
        homeworkSection.points = 0;
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.points.min);
    });

    it(`Should not validate if homework points is bigger than ${ homeworkSectionMaxPoints }`, () => {
        homeworkSection.points = 20000;
        fixtures.functions.models.testForInvalidModel(homeworkSection, db.schemas.definitions.homeworkSectionDefinition.points.max);
    });

});
