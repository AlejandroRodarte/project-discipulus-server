const { Types } = require('mongoose');
const expect = require('chai').expect;

const { aggregation } = require('../../../../../../src/shared/db');

describe('[db/aggregation/user-role] - getRolesPipeline', () => {

    it('Should return proper pipeline object', () => {

        const userId = new Types.ObjectId();
        const [firstStage] = aggregation.userRolePipelines.getRolesPipeline(userId);

        expect(firstStage.$match.user).to.equal(userId);

    });

});
