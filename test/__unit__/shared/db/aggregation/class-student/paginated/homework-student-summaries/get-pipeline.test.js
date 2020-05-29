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

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries] - homeworkStudentMatch', () => {

    it('Should attach completed flag if included', () => {

        const params = {
            page: 1,
            limit: 1,
            completed: true
        };

        const [, lookup] = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), true, params);

        const { pipeline } = lookup.$lookup;
        const [match] = pipeline;

        expect(match.$match.completed).to.equal(params.completed);

    });

    it('Should attach forced flag if included', () => {

        const params = {
            page: 1,
            limit: 1,
            forced: false
        };

        const [, lookup] = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), true, params);

        const { pipeline } = lookup.$lookup;
        const [match] = pipeline;

        expect(match.$match.forced).to.equal(params.forced);

    });

    it('Should attach published flag if included', () => {

        const params = {
            page: 1,
            limit: 1,
            published: true
        };

        const [, lookup] = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), true, params);

        const { pipeline } = lookup.$lookup;
        const [match] = pipeline;

        expect(match.$match.published).to.equal(params.published);

    });

});

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries] - homeworkMatch', () => {

    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });
    
    it('Should attach title regex search query if specified', () => {

        const params = {
            page: 1,
            limit: 1,
            'homework.title': 'sample'
        };
        
        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: true,
            homeworkMatch: {
                title: {
                    $regex: `^${ params['homework.title'] }`,
                    $options: 'i'
                }
            },
            rule: rules.types.NONE
        });

    });

    it('Should attach type match query if specified', () => {

        const params = {
            page: 1,
            limit: 1,
            'homework.type': shared.db.models.class.gradeType.NO_SECTIONS
        };
        
        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: true,
            homeworkMatch: {
                type: params['homework.type']
            },
            rule: rules.types.NONE
        });

    });

    it('Should attach published flag on restricted mode', () => {

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

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: true,
            requiresMiddlePipeline: true,
            homeworkMatch: {
                published: true
            },
            rule: rules.types.NONE
        });

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

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: true,
            requiresMiddlePipeline: true,
            homeworkMatch: {
                published: true
            },
            rule: rules.types.NONE
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries] - requiresHomeworkMatches/requiresMiddlePipeline', () => {

    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });

    it('Should require middle pipeline if a homework-match query is needed', () => {

        const params = {
            page: 1,
            limit: 1,
            'homework.title': 'sample'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: true,
            homeworkMatch: {
                title: {
                    $regex: `^${ params['homework.title'] }`,
                    $options: 'i'
                }
            },
            rule: rules.types.NONE
        });

    });

    it('Should not require middle pipeline if no homework-match query is needed', () => {

        const params = {
            page: 1,
            limit: 1
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: false,
            homeworkMatch: {},
            rule: rules.types.NONE
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries] - rule', () => {

    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;
    const sortMapper = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.sortMapper;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });

    it('Should call with special rule on special sortBy scenario', () => {

        const params = {
            page: 1,
            limit: 1,
            orderBy: 'grade,asc'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: false,
            homeworkMatch: {},
            rule: rules.types.GRADE
        });

    });

    it('Should fall back to a NONE rule scenario if no special orderBy parameter is provided', () => {

        const params = {
            page: 1,
            limit: 1,
            orderBy: '_id,desc'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: false,
            homeworkMatch: {},
            rule: rules.types.NONE
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries] - requiresSortMapper/requiresMiddlePipeline', () => {

    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;

    let getPipelinesForPaginationSpy;

    beforeEach(() => {
        getPipelinesForPaginationSpy = sinon.spy(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.helpers, 'getPipelinesForPagination');
    });

    it('Should require middle pipeline if sorting is based on homework data', () => {

        const params = {
            page: 1,
            limit: 1,
            orderBy: 'homework.title,asc'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: true,
            homeworkMatch: {},
            rule: rules.types.NONE
        });

    });

    it('Should not required middle pipeline if sorting is based not on homework-data (calculated values)', () => {

        const params = {
            page: 1,
            limit: 1,
            orderBy: 'points.sum,desc'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), false, params);

        sinon.assert.calledOnceWithExactly(getPipelinesForPaginationSpy, {
            restricted: false,
            requiresMiddlePipeline: false,
            homeworkMatch: {},
            rule: rules.types.POINTS_SUM
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries] - returned value', () => {

    const sortMapper = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.sortMapper;
    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;

    let aggregatePaginateSpy;

    beforeEach(() => {
        aggregatePaginateSpy = sinon.spy(aggregation.sharedPipelines, 'aggregatePaginate');
    });

    it('First stage should match by class-student _id', () => {

        const params = {
            page: 1,
            limit: 1
        };

        const classStudentId = new Types.ObjectId();

        const [match] = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(classStudentId, false, params);

        expect(match.$match._id).to.eql(classStudentId);

    });

    it('Should produce correct aggregatePaginate pipeline on no sortMapper scenario', () => {

        const params = {
            page: 1,
            limit: 1,
            completed: false,
            forced: true,
            published: false,
            'homework.title': 'sample',
            'homework.type': shared.db.models.class.gradeType.NO_SECTIONS,
            orderBy: 'points.sum,desc'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), true, params);

        const [middlePipeline, sortPipeline, docsPipeline] = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .helpers
                .getPipelinesForPagination({
                    restricted: true,
                    requiresMiddlePipeline: true,
                    homeworkMatch: {
                        title: {
                            $regex: `^${ params['homework.title'] }`,
                            $options: 'i'
                        },
                        type: params['homework.type'],
                        published: true
                    },
                    rule: rules.types.POINTS_SUM
                });

        const [field, order] = params.orderBy.split(',');

        sinon.assert.calledOnceWithExactly(aggregatePaginateSpy, {
            match: {
                $expr: {
                    $eq: [
                        '$classStudent',
                        '$$classStudentId'
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

    it('Should produce correct aggregatePaginate pipeline on sortMapper scenario', () => {

        const params = {
            page: 1,
            limit: 1,
            completed: false,
            forced: true,
            published: false,
            'homework.title': 'sample',
            'homework.type': shared.db.models.class.gradeType.NO_SECTIONS,
            orderBy: 'homework.grade,desc'
        };

        const pipeline = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .getPipeline(new Types.ObjectId(), true, params);

        const [middlePipeline, sortPipeline, docsPipeline] = 
            aggregation
                .classStudentPipelines
                .paginated
                .homeworkStudentSummaries
                .helpers
                .getPipelinesForPagination({
                    restricted: true,
                    requiresMiddlePipeline: true,
                    homeworkMatch: {
                        title: {
                            $regex: `^${ params['homework.title'] }`,
                            $options: 'i'
                        },
                        type: params['homework.type'],
                        published: true
                    },
                    rule: rules.types.NONE
                });

        const [field, order] = params.orderBy.split(',');

        sinon.assert.calledOnceWithExactly(aggregatePaginateSpy, {
            match: {
                $expr: {
                    $eq: [
                        '$classStudent',
                        '$$classStudentId'
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
                baseField: true,
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
