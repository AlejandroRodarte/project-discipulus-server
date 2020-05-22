const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/homework-student] - getSectionedGrades', () => {

    it('Should return proper pipeline object', () => {

        const homeworkStudentId = new Types.ObjectId();
        const pipeline = aggregation.homeworkStudentPipelines.getSectionedGrades(homeworkStudentId);

        expect(pipeline.length).to.equal(6);

        const [firstStage] = pipeline;
        expect(firstStage.$match._id).to.equal(homeworkStudentId);

    });

});
