const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');

const { uniqueUserRoleContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { userRole } = require('../../../../src/db/names');

const uniqueUserRoleContexttModelNames = Object.keys(uniqueUserRoleContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-role] - uniqueUserRole context', () => {

    beforeEach(db.init(uniqueUserRoleContext.persisted));
   
    describe('[db/models/user-role] - Non-unique user-roles', async () => {

        const nonUniqueUserRoleDoc = uniqueUserRoleContext.unpersisted[userRole.modelName][3];

        it('Should not persist a user-role that has the same user/role composite _id', async () => {
            const duplicateUserRole = new UserRole(nonUniqueUserRoleDoc);
            await expect(duplicateUserRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/modsls/user-role] - Unique user-roles', () => {
    
        const uniqueUserRoles = uniqueUserRoleContext.unpersisted[userRole.modelName];

        it('Should persist a user-role with same role _id and different user _id', async () => {
            const userRole = new UserRole(uniqueUserRoles[1]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with same user _id and different role _id', async () => {
            const userRole = new UserRole(uniqueUserRoles[0]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with different role and user _id', async () => {
            const userRole = new UserRole(uniqueUserRoles[2]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
    });
    
    afterEach(db.teardown(uniqueUserRoleContexttModelNames));

});
