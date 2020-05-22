const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/homework-student] - getHomeworkType', () => {

    it('Should return proper pipeline object', () => {

        const homeworkStudentId = new Types.ObjectId();
        const pipeline = aggregation.homeworkStudentPipelines.getHomeworkType(homeworkStudentId);

        expect(pipeline.length).to.equal(4);

        const [firstStage] = pipeline;
        expect(firstStage.$match._id).to.equal(homeworkStudentId);

    });

});
