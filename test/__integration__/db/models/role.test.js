const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');
const Role = require('../../../../src/db/models/role');

const { uniqueRoleContext, baseUserRoleContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/role] - uniqueRole context', () => {

    beforeEach(db.init(uniqueRoleContext.persisted));

    const unpersistedRoles = uniqueRoleContext.unpersisted[names.role.modelName]

    describe('[db/models/role] - non-unique role name', () => {

        const roleDoc = unpersistedRoles[1];

        it('Should not persist a role with a non unique role name', async () => {
            const role = new Role(roleDoc);
            await expect(role.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
        
    });
    
    describe('[db/models/role] - unique role name', () => {
    
        const roleDoc = unpersistedRoles[0];

        it('Should persist a role with a unique role name', async () => {
            const role = new Role(roleDoc);
            await expect(role.save()).to.eventually.be.eql(role);
        });
        
    });

    afterEach(db.teardown(uniqueRoleContext.persisted));

});

describe('[db/models/role] - baseUserRole context', () => {

    beforeEach(db.init(baseUserRoleContext.persisted));

    const persistedRoles = baseUserRoleContext.persisted[names.role.modelName];

    describe('[db/models/role] - Pre remove hook', () => {

        const persistedRoleOneId = persistedRoles[0]._id;

        it('Should remove user-role association upon role deletion', async () => {

            const role = await Role.findOne({ _id: persistedRoleOneId });
            await role.remove();

            const userRoleDocCount = await UserRole.countDocuments({
                role: persistedRoleOneId
            });

            expect(userRoleDocCount).to.equal(0);

        });

    });

    afterEach(db.teardown(baseUserRoleContext.persisted));

});
