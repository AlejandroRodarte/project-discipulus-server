const { Types } = require('mongoose');
const expect = require('chai').expect;

const getRolesPipeline = require('../../../../../src/db/aggregation/user-role/get-roles-pipeline');

describe('[db/aggregation/user-role] - getRolesPipeline', () => {

    it('Should return proper pipeline object', () => {

        const userId = new Types.ObjectId();
        const [firstStage] = getRolesPipeline(userId);

        expect(firstStage.$match.user).to.equal(userId);

    });

});
