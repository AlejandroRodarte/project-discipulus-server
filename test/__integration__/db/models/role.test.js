const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

const { mongo } = require('mongoose');

const roleContexts = require('../../../__fixtures__/functions/db/models/role');

const { nonUniqueRoles } = require('../../../__fixtures__/models/role/unpersisted');

const db = require('../../../../src/db');

describe('Non-unique role names', () => {

    before(db.mongoose.connect);
    beforeEach(roleContexts.sampleRole.init);

    it('Should not persist a role with a non unique role name', async () => {
        await expect(nonUniqueRoles.nonUniqueNameRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
    });

    afterEach(roleContexts.sampleRole.teardown);
    after(db.mongoose.disconnect);

});
