const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/class-student] - isStudentEnabled', () => {

    it('Should return proper pipeline object', () => {

        const classStudentId = new Types.ObjectId();
        const pipeline = aggregation.classStudentPipelines.isStudentEnabled(classStudentId);

        expect(pipeline.length).to.equal(4);

        const [firstStage] = pipeline;
        expect(firstStage.$match._id).to.equal(classStudentId);

    });

});