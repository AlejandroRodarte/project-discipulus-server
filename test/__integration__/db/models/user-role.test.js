const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-role] - uniqueUserRole context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueUserRoleContext.persisted));

    const unpersistedUserRoles = fixtures.models.uniqueUserRoleContext.unpersisted[shared.db.names.userRole.modelName]
   
    describe('[db/models/user-role] - Non-unique user-roles', async () => {

        const userRoleDoc = unpersistedUserRoles[3];

        it('Should not persist a user-role that has the same user/role composite _id', async () => {
            const userRole = new db.models.UserRole(userRoleDoc);
            await expect(userRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/user-role] - Unique user-roles', () => {

        it('Should persist a user-role with same role _id and different user _id', async () => {
            const userRole = new db.models.UserRole(unpersistedUserRoles[1]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with same user _id and different role _id', async () => {
            const userRole = new db.models.UserRole(unpersistedUserRoles[0]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
        it('Should persist a user-role with different role and user _id', async () => {
            const userRole = new db.models.UserRole(unpersistedUserRoles[2]);
            await expect(userRole.save()).to.eventually.be.eql(userRole);
        });
    
    });
    
    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueUserRoleContext.persisted));

});

describe('[db/models/user-role] - baseUserRole context', async () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserRoleContext.persisted));

    const unpersistedUserRoles = fixtures.models.baseUserRoleContext.unpersisted[shared.db.names.userRole.modelName];

    describe('[db/models/user-role] - methods.checkAndSave', async () => {

        it('Should not persist if user does not exist', async () => {

            const userRoleDoc = unpersistedUserRoles[0];
            const userRole = new db.models.UserRole(userRoleDoc);

            await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if user is disabled', async () => {

            const userRoleDoc = unpersistedUserRoles[1];
            const userRole = new db.models.UserRole(userRoleDoc);

            await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if role does not exist', async () => {

            const userRoleDoc = unpersistedUserRoles[2];
            const userRole = new db.models.UserRole(userRoleDoc);

            await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.roleNotFound);

        });

        it('Should throw error if userRole.save fails', async () => {

            const userRoleDoc = unpersistedUserRoles[3];
            const userRole = new db.models.UserRole(userRoleDoc);

            await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper user-role doc', async () => {

            const userRoleDoc = unpersistedUserRoles[4];
            const userRole = new db.models.UserRole(userRoleDoc);

            await expect(userRole.checkAndSave()).to.eventually.eql(userRole);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserRoleContext.persisted));

});
