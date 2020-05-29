const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/homework/get-details] - general flow', () => {

    it('Should produce correct pipeline', () => {

        const homeworkId = new Types.ObjectId();

        const pipeline = aggregation.homeworkPipelines.getDetails(homeworkId);
        expect(pipeline.length).to.equal(7);

        const [firstStage] = pipeline;
        expect(firstStage.$match._id).to.eql(homeworkId);

    });

});
