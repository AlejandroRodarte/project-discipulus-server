const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');
const userRoleContexts = require('../../../__fixtures__/functions/db/models/user-role');
const { nonUniqueUserRole, uniqueUserRoles } = require('../../../__fixtures__/models/user-role/unpersisted');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-role] - sampleUserRole context', () => {

    beforeEach(userRoleContexts.sampleUserRole.init.fn);
   
    describe('[db/models/user-role] - Non-unique user-roles', async () => {

        it('Should not persist a user-role that has the same user/role composite _id', async () => {
            const duplicateUserRole = new UserRole(nonUniqueUserRole);
            await expect(duplicateUserRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/modsls/user-role] - Unique user-roles', () => {
    
        it('Should persist a user-role with same role _id and different user _id', async () => {
            const userRole = new UserRole(uniqueUserRoles.sameRole);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with same user _id and different role _id', async () => {
            const userRole = new UserRole(uniqueUserRoles.sameUser);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with different role and user _id', async () => {
            const userRole = new UserRole(uniqueUserRoles.unique);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
    });
    
    afterEach(userRoleContexts.sampleUserRole.teardown);

});
