const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');
const Role = require('../../../../src/db/models/role');

const roleContexts = require('../../../__fixtures__/functions/db/models/role');
const userRoleContexts = require('../../../__fixtures__/functions/db/models/user-role');

const { roles } = require('../../../__fixtures__/models/role/persisted');
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

describe('[db/models/role] - singleUserRole context', () => {

    beforeEach(userRoleContexts.singleUserRole.init);

    describe('[db/models/role] - Pre remove hook', () => {

        it('Should remove user-role association upon role deletion', async () => {

            const role = await Role.findOne({ _id: roles[0]._id });
            await role.remove();

            const userRoleDocCount = await UserRole.countDocuments({});
            expect(userRoleDocCount).to.equal(0);

        });

    });

    afterEach(userRoleContexts.singleUserRole.teardown);

});
