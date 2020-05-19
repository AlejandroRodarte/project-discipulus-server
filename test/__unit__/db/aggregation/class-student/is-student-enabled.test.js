const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../src/db');

describe('[db/aggregation/class-student] - isStudentEnabled', () => {

    it('Should return proper pipeline object', () => {

        const classStudentId = new Types.ObjectId();
        const [firstStage] = aggregation.classStudentPipelines.isStudentEnabled(classStudentId);

        expect(firstStage.$match._id).to.equal(classStudentId);

    });

});