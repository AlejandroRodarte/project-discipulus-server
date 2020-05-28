const expect = require('chai').expect;

const { aggregation } = require('../../../../../../../../../src/shared/db');

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries/stages/get-homework-student-project] - general flow', () => {

    it('Should project correct grade conditional value under restricted flag (only display grade on published homeworks)', () => {

        const [firstStage] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentProject(true);
        const [, thenExpr, elseExpr] = firstStage.$project.grade.$cond;

        expect(thenExpr).to.eql({
            $cond: [
                {
                    $eq: [
                        '$published',
                        true
                    ]
                },
                '$directGrade',
                '$$REMOVE'
            ]
        });

        expect(elseExpr).to.eql({
            $cond: [
                {
                    $eq: [
                        '$published',
                        true
                    ]
                },
                {
                    $multiply: [
                        '$homework.grade',
                        {
                            $divide: [
                                '$points.sum',
                                '$homework.points.sum'
                            ]
                        }
                    ]
                },
                '$$REMOVE'
            ]
        });

    });

    it('Should project correct grade conditional value without a restricted flag (display all grades)', () => {

        const [firstStage] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkStudentProject(false);
        const [, thenExpr, elseExpr] = firstStage.$project.grade.$cond;

        expect(thenExpr).to.equal('$directGrade');

        expect(elseExpr).to.eql({
            $multiply: [
                '$homework.grade',
                {
                    $divide: [
                        '$points.sum',
                        '$homework.points.sum'
                    ]
                }
            ]
        });

    });

});