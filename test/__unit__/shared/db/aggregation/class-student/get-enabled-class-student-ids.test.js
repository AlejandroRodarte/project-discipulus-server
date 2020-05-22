const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[db/aggregation/class-student] - getEnabledClassStudentIds', () => {

    it('Should return proper pipeline object', () => {

        const classId = new Types.ObjectId();
        const [firstStage] = aggregation.classStudentPipelines.getEnabledClassStudentIds(classId);

        expect(firstStage.$match.class).to.equal(classId);

    });

});

