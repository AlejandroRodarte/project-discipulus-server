const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/role] - uniqueRole context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueRoleContext.persisted));

    const unpersistedRoles = fixtures.models.uniqueRoleContext.unpersisted[shared.db.names.role.modelName]

    describe('[db/models/role] - non-unique role name', () => {

        const roleDoc = unpersistedRoles[1];

        it('Should not persist a role with a non unique role name', async () => {
            const role = new db.models.Role(roleDoc);
            await expect(role.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
        
    });
    
    describe('[db/models/role] - unique role name', () => {
    
        const roleDoc = unpersistedRoles[0];

        it('Should persist a role with a unique role name', async () => {
            const role = new db.models.Role(roleDoc);
            await expect(role.save()).to.eventually.be.eql(role);
        });
        
    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueRoleContext.persisted));

});

describe('[db/models/role] - baseUserRole context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserRoleContext.persisted));

    const persistedRoles = fixtures.models.baseUserRoleContext.persisted[shared.db.names.role.modelName];

    describe('[db/models/role] - Pre remove hook', () => {

        const persistedRoleOneId = persistedRoles[0]._id;

        it('Should remove user-role association upon role deletion', async () => {

            const role = await db.models.Role.findOne({ _id: persistedRoleOneId });
            await role.remove();

            const userRoleDocCount = await db.models.UserRole.countDocuments({
                role: persistedRoleOneId
            });

            expect(userRoleDocCount).to.equal(0);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserRoleContext.persisted));

});
