const expect = require('chai').expect;

const moment = require('moment');

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const timeRangeDoc = {
    start: 0,
    end: 10
};

let timeRange = new db.models.shared.TimeRange(timeRangeDoc);

beforeEach(() => timeRange = fixtures.functions.models.getNewModelInstance(db.models.shared.TimeRange, timeRangeDoc));

describe('[db/models/shared/time-range] - Default start', () => {

    it('Should set default timestamp if start time is not provided', () => {
    
        const end = moment().add(1, 'second').utc().unix();
        timeRange = new db.models.shared.TimeRange({ end });

        expect(timeRange.start).to.be.a('number');

    });

});

describe('[db/models/shared/time-range] - Invalid end', () => {

    it('Should not validate if end date is undefined', () => {
        timeRange.end = undefined;
        fixtures.functions.models.testForInvalidModel(timeRange, db.schemas.shared.definitions.sharedTimeRangeDefinition.end.required);
    });

    it('Should not validate if end date is smaller than start date', () => {
        timeRange.end = -1;
        fixtures.functions.models.testForInvalidModel(timeRange, db.schemas.shared.definitions.sharedTimeRangeDefinition.end.validate);
    });

});

describe('[db/models/shared/time-range] - Valid end', () => {

    it('Should validate if end date is greater than start date', () => {
        fixtures.functions.models.testForValidModel(timeRange);
    });

});

describe('[db/models/shared/time-range] - virtuals.duration', () => {

    it('Should provide time range duration', () => {
        expect(timeRange.duration).to.equal(timeRange.end - timeRange.start);
    });

});
