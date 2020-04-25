const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo, connection } = require('mongoose');

const Role = require('../../../../src/db/models/role');
const roleContexts = require('../../../__fixtures__/functions/db/models/role');
const { nonUniqueRoles, uniqueRoles } = require('../../../__fixtures__/models/role/unpersisted');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/role] - sampleRole context', () => {

    beforeEach(roleContexts.sampleRole.init);

    describe('[db/models/role] - non-unique role name', () => {

        it('Should not persist a role with a non unique role name', async () => {
            const duplicateRole = new Role(nonUniqueRoles.nonUniqueNameRole);
            await expect(duplicateRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
        
    });
    
    describe('[db/models/role] - unique role name', () => {
    
        it('Should persist a role with a unique role name', async () => {
            const uniqueRole = new Role(uniqueRoles[0]);
            await expect(uniqueRole.save()).to.eventually.be.eql(uniqueRole);
        });
        
    });

    afterEach(roleContexts.sampleRole.teardown);

});
