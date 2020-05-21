const expect = require('chai').expect;

const moment = require('moment');

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const optionalEndTimeRangeDoc = { start: 30 };

let optionalEndTimeRange = new db.models.shared.OptionalEndTimeRange(optionalEndTimeRangeDoc);

beforeEach(() => optionalEndTimeRange = fixtures.functions.models.getNewModelInstance(db.models.shared.OptionalEndTimeRange, optionalEndTimeRangeDoc));

describe('[db/models/shared/optional-end-time-range] - Default start', () => {

    it('Should set default timestamp if start time is not provided', () => {
        optionalEndTimeRange = new db.models.shared.OptionalEndTimeRange();
        expect(optionalEndTimeRange.start).to.be.a('number');
    });

});

describe('[db/models/shared/optional-end-time-range] - Undefined end', () => {

    it('Should validate if end date is undefined', () => {
        optionalEndTimeRange.end = undefined;
        fixtures.functions.models.testForValidModel(optionalEndTimeRange);
    });

});

describe('[db/models/shared/optional-end-time-range] - Invalid end', () => {

    it('Should not validate if end date is smaller than start date', () => {
        optionalEndTimeRange.end = -1;
        fixtures.functions.models.testForInvalidModel(optionalEndTimeRange, db.schemas.shared.definitions.sharedTimeRangeDefinition.end.validate);
    });

});

describe('[db/models/shared/optional-end-time-range] - Valid end', () => {

    it('Should validate if end date is greater than start date', () => {
        optionalEndTimeRange.end = 100;
        fixtures.functions.models.testForValidModel(optionalEndTimeRange);
    });

});

describe('[db/models/shared/optional-end-time-range] - virtuals.duration', () => {

    it('Should return undefined if no end is defined', () => {
        expect(optionalEndTimeRange.duration).to.be.undefined;
    });

    it('Should provide time range duration if end is specified', () => {
        optionalEndTimeRange.end = 100;
        expect(optionalEndTimeRange.duration).to.equal(optionalEndTimeRange.end - optionalEndTimeRange.start);
    });

});

