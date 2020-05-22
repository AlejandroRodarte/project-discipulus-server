const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[shared/db/aggregation/class-student] - getEnabledClassStudentIds', () => {

    it('Should return proper pipeline object', () => {

        const classId = new Types.ObjectId();
        const pipeline = aggregation.classStudentPipelines.getEnabledClassStudentIds(classId);

        expect(pipeline.length).to.equal(5);

        const [firstStage] = pipeline;
        expect(firstStage.$match.class).to.equal(classId);

    });

});

