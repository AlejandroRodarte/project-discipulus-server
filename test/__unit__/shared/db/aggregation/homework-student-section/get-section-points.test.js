const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/homework-student-section] - getSectionPoints', () => {

    it('Should return proper pipeline object', () => {

        const homeworkStudentSectionId = new Types.ObjectId();
        const pipeline = aggregation.homeworkStudentSectionPipelines.getSectionPoints(homeworkStudentSectionId);

        expect(pipeline.length).to.equal(4);

        const [firstStage] = pipeline;
        expect(firstStage.$match._id).to.equal(homeworkStudentSectionId);

    });

});
