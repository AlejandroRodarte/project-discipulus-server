const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../../../../src/db');
const shared = require('../../../../../../../../src/shared');
const api = require('../../../../../../../../src/api');
const util = require('../../../../../../../../src/util');
const fixtures = require('../../../../../../../__fixtures__');

const { aggregation } = require('../../../../../../../../src/shared/db');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[shared/db/aggregation/homework/paginated/homework-student-summaries/get-pipeline-test] - homeworkStudentMatch', () => {

    it('Should attach completed flag if specified', () => {

        const params = {
            page: 1,
            limit: 1,
            completed: false
        };

        const [,,, homeworkStudentLookup] =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        const { pipeline: homeworkStudentPipeline } = homeworkStudentLookup.$lookup;
        const [homeworkStudentMatch] = homeworkStudentPipeline;

        expect(homeworkStudentMatch.$match.completed).to.equal(params.completed);

    });

    it('Should attach forced flag if specified', () => {

        const params = {
            page: 1,
            limit: 1,
            forced: true
        };

        const [,,, homeworkStudentLookup] =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        const { pipeline: homeworkStudentPipeline } = homeworkStudentLookup.$lookup;
        const [homeworkStudentMatch] = homeworkStudentPipeline;

        expect(homeworkStudentMatch.$match.forced).to.equal(params.forced);

    });

    it('Should attach published flag if specified', () => {

        const params = {
            page: 1,
            limit: 1,
            published: false
        };

        const [,,, homeworkStudentLookup] =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        const { pipeline: homeworkStudentPipeline } = homeworkStudentLookup.$lookup;
        const [homeworkStudentMatch] = homeworkStudentPipeline;

        expect(homeworkStudentMatch.$match.published).to.equal(params.published);

    });

});

describe('[shared/db/aggregation/homework/paginated/homework-student-summaries/get-pipeline-test] - userMatch', () => {

    const rules = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });

    it('Should call getPipelinesForPagination with correct userMatch con user name match query', () => {

        const params = {
            page: 1,
            limit: 1,
            'user.name': 'sample'
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            name: {
                $regex: `^${ params['user.name'] }`,
                $options: 'i'
            }
        }, {
            match: rules.types.USER,
            sort: rules.types.NONE
        });

    });

    it('Should call getPipelinesForPagination with correct userMatch con username match query', () => {

        const params = {
            page: 1,
            limit: 1,
            'user.username': 'sample'
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            username: {
                $regex: `^${ params['user.username'] }`,
                $options: 'i'
            }
        }, {
            match: rules.types.USER,
            sort: rules.types.NONE
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[shared/db/aggregation/homework/paginated/homework-student-summaries/get-pipeline-test] - queryRules', () => {

    const rules = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });

    it('Should set match query to USER if at least one exists', () => {

        const params = {
            page: 1,
            limit: 1,
            'user.name': 'sample'
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            name: {
                $regex: `^${ params['user.name'] }`,
                $options: 'i'
            }
        }, {
            match: rules.types.USER,
            sort: rules.types.NONE
        });

    });
    
    it('Should set match query to NONE if at none exist', () => {

        const params = {
            page: 1,
            limit: 1
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {}, {
            match: rules.types.NONE,
            sort: rules.types.NONE
        });

    });

    it('Should set sort query to USER if at least one exists', () => {

        const params = {
            page: 1,
            limit: 1,
            orderBy: 'user.username,desc'
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {}, {
            match: rules.types.NONE,
            sort: rules.types.USER
        });

    });

    it('Should set sort query to NONE if none exist', () => {

        const params = {
            page: 1,
            limit: 1
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {}, {
            match: rules.types.NONE,
            sort: rules.types.NONE
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[shared/db/aggregation/homework/paginated/homework-student-summaries/get-pipeline-test] - return value', () => {

    const sortMapper = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.values.sortMapper;
    const rules = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;
    let aggregatePaginateSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
        aggregatePaginateSpy = sinon.spy(aggregation.sharedPipelines, 'aggregatePaginate');
    });

    it('First pipeline stage should match with the homework _id', () => {

        const params = {
            page: 1,
            limit: 1,
            'user.username': 'sample'
        };

        const homeworkId = new Types.ObjectId();

        const [firstStage] =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(homeworkId, params);

        expect(firstStage.$match._id).to.eql(homeworkId);

    });

    it('Should call aggregatePaginate with correct args when sortMapper is not needed', () => {

        const params = {
            page: 1,
            limit: 1,
            completed: false,
            forced: true,
            published: true,
            'user.name': 'sample',
            'user.username': 'cool',
            orderBy: 'points.sum,desc'
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        const [middlePipeline, sortPipeline, docsPipeline] =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .helpers
                .getPipelinesForPagination({
                    name: {
                        $regex: `^${ params['user.name'] }`,
                        $options: 'i'
                    },
                    username: {
                        $regex: `^${ params['user.username'] }`,
                        $options: 'i'
                    }
                }, {
                    match: rules.types.USER,
                    sort: rules.types.POINTS_SUM
                });

        const [field, order] = params.orderBy.split(',');

        sinon.assert.calledOnceWithExactly(aggregatePaginateSpy, {
            match: {
                $expr: {
                    $eq: [
                        '$homework',
                        '$$homeworkId'
                    ]
                },
                completed: params.completed,
                forced: params.forced,
                published: params.published
            },
            middle: {
                include: true,
                pipeline: middlePipeline
            },
            sort: {
                baseField: false,
                pipeline: sortPipeline,
                params: {
                    fieldName: field,
                    order: order === 'asc' ? 1 : -1
                }
            },
            page: params.page,
            limit: params.limit,
            pipeline: docsPipeline
        });

    });

    it('Should call aggregatePaginate with correct args when sortMapper needed', () => {

        const params = {
            page: 1,
            limit: 1,
            completed: false,
            forced: true,
            published: true,
            'user.name': 'sample',
            'user.username': 'cool',
            orderBy: 'user.name,desc'
        };

        const pipeline =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), params);

        const [middlePipeline, sortPipeline, docsPipeline] =
            aggregation
                .homeworkPipelines
                .paginated
                .homeworkStudentSummaries
                .helpers
                .getPipelinesForPagination({
                    name: {
                        $regex: `^${ params['user.name'] }`,
                        $options: 'i'
                    },
                    username: {
                        $regex: `^${ params['user.username'] }`,
                        $options: 'i'
                    }
                }, {
                    match: rules.types.USER,
                    sort: rules.types.USER
                });

        const [field, order] = params.orderBy.split(',');

        sinon.assert.calledOnceWithExactly(aggregatePaginateSpy, {
            match: {
                $expr: {
                    $eq: [
                        '$homework',
                        '$$homeworkId'
                    ]
                },
                completed: params.completed,
                forced: params.forced,
                published: params.published
            },
            middle: {
                include: true,
                pipeline: middlePipeline
            },
            sort: {
                baseField: false,
                pipeline: sortPipeline,
                params: {
                    fieldName: sortMapper[field],
                    order: order === 'asc' ? 1 : -1
                }
            },
            page: params.page,
            limit: params.limit,
            pipeline: docsPipeline
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
