const expect = require('chai').expect;

const { aggregation, names } = require('../../../../../../../../../src/shared/db');

describe('[shared/db/aggregation/class-student/paginated/homework-student-summaries/stages/get-homework-section-points-sum] - general flow', () => {

    it('Should produce correct output', () => {

        const [firstStage, secondStage] = aggregation.classStudentPipelines.paginated.homeworkStudentSummaries.stages.getHomeworkSectionPointsSum();
        expect(firstStage.$lookup.from).to.equal(names.homework.collectionName);
        
        const [, homeworkSectionStage] = firstStage.$lookup.pipeline;
        expect(homeworkSectionStage.$lookup.from).to.equal(names.homeworkSection.collectionName);

        expect(secondStage.$unwind).to.equal('$homework');

    });

});
