const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');
const Role = require('../../../../src/db/models/role');

const { uniqueRoleContext, baseUserRoleContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { role } = require('../../../../src/db/names');

const uniqueRoleContextModelNames = Object.keys(uniqueRoleContext.persisted);
const baseUserRoleContextModelNames = Object.keys(baseUserRoleContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/role] - uniqueRole context', () => {

    beforeEach(db.init(uniqueRoleContext.persisted));

    describe('[db/models/role] - non-unique role name', () => {

        const nonUniqueRoleDoc = uniqueRoleContext.unpersisted[role.modelName][1];

        it('Should not persist a role with a non unique role name', async () => {
            const duplicateRole = new Role(nonUniqueRoleDoc);
            await expect(duplicateRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
        
    });
    
    describe('[db/models/role] - unique role name', () => {
    
        const uniqueRoleDoc = uniqueRoleContext.unpersisted[role.modelName][0];

        it('Should persist a role with a unique role name', async () => {
            const uniqueRole = new Role(uniqueRoleDoc);
            await expect(uniqueRole.save()).to.eventually.be.eql(uniqueRole);
        });
        
    });

    afterEach(db.teardown(uniqueRoleContextModelNames));

});

describe('[db/models/role] - baseUserRole context', () => {

    beforeEach(db.init(baseUserRoleContext.persisted));

    describe('[db/models/role] - Pre remove hook', () => {

        const persistedRoleId = baseUserRoleContext.persisted[role.modelName][0]._id;

        it('Should remove user-role association upon role deletion', async () => {

            const role = await Role.findOne({ _id: persistedRoleId });
            await role.remove();

            const userRoleDocCount = await UserRole.countDocuments({});
            expect(userRoleDocCount).to.equal(0);

        });

    });

    afterEach(db.teardown(baseUserRoleContextModelNames));

});
