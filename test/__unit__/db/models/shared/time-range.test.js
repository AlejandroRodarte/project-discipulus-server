const expect = require('chai').expect;

const { Types } = require('mongoose');
const moment = require('moment');

const { sharedTimeRangeDefinition } = require('../../../../../src/db/schemas/shared/time-range');
const { testForInvalidModel, testForValidModel, getNewModelInstance } = require('../../../../__fixtures__/functions/models');

const { TimeRange } = require('../../../../../src/db/models/shared');

const timeRangeDoc = {
    start: 0,
    end: 10
};

let timeRange = new TimeRange(timeRangeDoc);

beforeEach(() => timeRange = getNewModelInstance(TimeRange, timeRangeDoc));

describe('[db/models/shared/time-range] - Default start', () => {

    it('Should set default timestamp if start time is not provided', () => {
    
        const end = moment().add(1, 'second').utc().unix();
        timeRange = new TimeRange({ end });

        expect(timeRange.start).to.not.be.an('integer');

    });

});

describe('[db/models/shared/time-range] - Invalid end', () => {

    it('Should not validate if end date is undefined', () => {
        timeRange.end = undefined;
        testForInvalidModel(timeRange, sharedTimeRangeDefinition.end.required);
    });

    it('Should not validate if end date is smaller than start date', () => {
        timeRange.end = -1;
        testForInvalidModel(timeRange, sharedTimeRangeDefinition.end.validate);
    });

});

describe('[db/models/shared/time-range] - Valid end', () => {

    it('Should validate if end date is greater than start date', () => {
        testForValidModel(timeRange);
    });

});
