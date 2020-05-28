const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation, names } = require('../../../../../../../../src/shared/db');

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries/get-pipelines-for-pagination] - general flow', () => {

    const rules = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.values.rules;

    it('Include homework $lookup if middle pipeline is required along with its match object', () => {

        const [middlePipeline] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.getPipelinesForPagination({
            requiresMiddlePipeline: true,
            homeworkMatch: {
                published: true
            }
        });

        const [lookup] = middlePipeline;
        const { from: fromExpr, pipeline: homeworkPipeline } = lookup.$lookup;
        const [homeworkMatch] = homeworkPipeline;

        expect(fromExpr).to.equal(names.homework.collectionName);
        expect(homeworkMatch.$match.published).to.equal(true);

    });

    it('Produce correct pipelines on rules.types.POINTS_SUM scenario', () => {

        const [, sortPipeline, docsPipeline] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.getPipelinesForPagination({
            rule: rules.types.POINTS_SUM
        });

        expect(sortPipeline).to.eql(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentSectionPointsSum(true));
        expect(docsPipeline).to.eql([
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkSectionPointsSum(),
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentProject(true)
        ]);

    });

    it('Produce correct pipelines on rules.types.HOMEWORK_POINTS_SUM scenario', () => {

        const [, sortPipeline, docsPipeline] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.getPipelinesForPagination({
            rule: rules.types.HOMEWORK_POINTS_SUM
        });

        expect(sortPipeline).to.eql(aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkSectionPointsSum());
        expect(docsPipeline).to.eql([
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentSectionPointsSum(),
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentProject(true)
        ]);

    });

    it('Produce correct pipelines on rules.types.GRADE scenario', () => {

        const [, sortPipeline, docsPipeline] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.getPipelinesForPagination({
            rule: rules.types.GRADE
        });

        expect(sortPipeline).to.eql([
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentSectionPointsSum(true),
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkSectionPointsSum(),
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentProject(true)
        ]);
        expect(docsPipeline).to.eql([]);

    });

    it('Produce correct pipelines on rules.types.NONE scenario', () => {

        const [, sortPipeline, docsPipeline] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.getPipelinesForPagination({
            rule: rules.types.NONE
        });

        expect(sortPipeline).to.eql([]);
        expect(docsPipeline).to.eql([
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentSectionPointsSum(true),
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkSectionPointsSum(),
            ...aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentProject(true)
        ]);

    });

});
