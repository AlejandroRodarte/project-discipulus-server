const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../../../../src/db');
const shared = require('../../../../../../../../src/shared');
const api = require('../../../../../../../../src/api');
const fixtures = require('../../../../../../../__fixtures__');

const { aggregation } = require('../../../../../../../../src/shared/db');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries]', () => {

    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });

    it('Should require middle pipeline if there is a homework-based match query', () => {

        const params = {
            page: 1,
            limit: 1
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), true, params);

        sinon.assert.calledOnce(getPipelinesForPaginationSpy);
        // sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, true, true, {}, rules.types.NONE);

    });

    afterEach(() => {
        sinon.restore();
    });

});
