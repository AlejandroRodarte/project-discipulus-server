const expect = require('chai').expect;

const { aggregation, names } = require('../../../../../../../../../src/shared/db');

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries/stages/get-homework-student-section-points-sum] - general flow', () => {

    it('$let and $match dynamic expressions should be correct when restricted flag is set to true', () => {

        const [firstStage] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentSectionPointsSum(true);
        const { from: fromExpr, let: letExpr, pipeline } = firstStage.$lookup;
        const [matchExpr] = pipeline;

        expect(fromExpr).to.equal(names.homeworkStudentSection.collectionName);

        expect(letExpr).to.eql({
            homeworkStudentId : '$_id',
            homeworkStudentPublished: '$published'
        });

        expect(matchExpr.$match.$expr).to.eql({
            $and: [
                {
                    $eq: [
                        '$$homeworkStudentPublished',
                        true
                    ]
                },
                {
                    $eq: [
                        '$homeworkStudent',
                        '$$homeworkStudentId'
                    ]
                }
            ]
        });

    });

    it('$let and $match dynamic expressions should be correct when restricted flag is set to false', () => {

        const [firstStage] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentSectionPointsSum(false);
        const { from: fromExpr, let: letExpr, pipeline } = firstStage.$lookup;
        const [matchExpr] = pipeline;

        expect(fromExpr).to.equal(names.homeworkStudentSection.collectionName);

        expect(letExpr).to.eql({
            homeworkStudentId : '$_id'
        });

        expect(matchExpr.$match.$expr).to.eql({
            $eq: [
                '$homeworkStudent',
                '$$homeworkStudentId'
            ]
        });

    });

});