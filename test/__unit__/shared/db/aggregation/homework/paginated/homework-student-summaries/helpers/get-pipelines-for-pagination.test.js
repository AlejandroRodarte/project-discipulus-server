const expect = require('chai').expect;

const { aggregation, names } = require('../../../../../../../../../src/shared/db');

describe('[shared/db/aggregation/homework/paginated/homework-student-summaries/helpers/get-pipelines-for-pagination] - general flow', () => {

    const rules = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.values.rules;

    it('Should attach to middle pipeline user info if match query rules is of type USER', () => {

        const userMatch = {};

        const queryRules = {
            match: rules.types.USER,
            sort: rules.types.NONE
        };

        const [middlePipeline] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers.getPipelinesForPagination(userMatch, queryRules);

        expect(middlePipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo(userMatch)
        ]);

    });

    it('Should attach to middle pipeline user info if sort query rules is of type USER', () => {

        const userMatch = {};

        const queryRules = {
            match: rules.types.NONE,
            sort: rules.types.USER
        };

        const [middlePipeline] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers.getPipelinesForPagination(userMatch, queryRules);

        expect(middlePipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo(userMatch)
        ]);

    });

    it('Should attach user info to doc pipeline if no rules are provided', () => {

        const userMatch = {};

        const queryRules = {
            match: rules.types.NONE,
            sort: rules.types.NONE
        };

        const [,, docsPipeline] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers.getPipelinesForPagination(userMatch, queryRules);
        const [firstStage, secondStage] = docsPipeline;

        expect([firstStage, secondStage]).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo()
        ]);

    });

    it('Should provide correct sort and docs pipelines in POINTS_SUM case', () => {

        const userMatch = {};

        const queryRules = {
            match: rules.types.NONE,
            sort: rules.types.POINTS_SUM
        };

        const [, sortPipeline, docsPipeline] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers.getPipelinesForPagination(userMatch, queryRules);

        expect(sortPipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.homeworkStudentSectionPointsSum
        ]);

        expect(docsPipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo(),
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.homeworkStudentProject
        ]);

    });

    it('Should provide correct sort and docs pipelines in GRADE case', () => {

        const userMatch = {};

        const queryRules = {
            match: rules.types.NONE,
            sort: rules.types.GRADE
        };

        const [, sortPipeline, docsPipeline] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers.getPipelinesForPagination(userMatch, queryRules);

        expect(sortPipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.homeworkStudentSectionPointsSum,
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.homeworkStudentProject
        ]);

        expect(docsPipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo(),
        ]);

    });

    it('Should provide correct sort and docs pipelines in NONE/USER case', () => {

        const userMatch = {};

        const queryRules = {
            match: rules.types.NONE,
            sort: rules.types.NONE
        };

        const [, sortPipeline, docsPipeline] = aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.helpers.getPipelinesForPagination(userMatch, queryRules);

        expect(sortPipeline).to.eql([]);

        expect(docsPipeline).to.eql([
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.getUserInfo(),
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.homeworkStudentSectionPointsSum,
            ...aggregation.homeworkPipelines.paginated.homeworkStudentSummaries.stages.homeworkStudentProject
        ]);

    });

});