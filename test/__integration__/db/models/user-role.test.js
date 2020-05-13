const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');

const { uniqueUserRoleContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-role] - uniqueUserRole context', () => {

    beforeEach(db.init(uniqueUserRoleContext.persisted));

    const unpersistedUserRoles = uniqueUserRoleContext.unpersisted[names.userRole.modelName]
   
    describe('[db/models/user-role] - Non-unique user-roles', async () => {

        const userRoleDoc = unpersistedUserRoles[3];

        it('Should not persist a user-role that has the same user/role composite _id', async () => {
            const userRole = new UserRole(userRoleDoc);
            await expect(userRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/user-role] - Unique user-roles', () => {

        it('Should persist a user-role with same role _id and different user _id', async () => {
            const userRole = new UserRole(unpersistedUserRoles[1]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with same user _id and different role _id', async () => {
            const userRole = new UserRole(unpersistedUserRoles[0]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with different role and user _id', async () => {
            const userRole = new UserRole(unpersistedUserRoles[2]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
    });
    
    afterEach(db.teardown(uniqueUserRoleContext.persisted));

});
