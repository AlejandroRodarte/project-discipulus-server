const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const UserRole = require('../../../../src/db/models/user-role');
const Role = require('../../../../src/db/models/role');

const { sampleRoleContext, singleUserRoleContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { role } = require('../../../../src/db/names');

const sampleRoleContextModelNames = Object.keys(sampleRoleContext.persisted);
const singleUserRoleContextModelNames = Object.keys(singleUserRoleContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/role] - sampleRole context', () => {

    beforeEach(db.init(sampleRoleContext.persisted));

    describe('[db/models/role] - non-unique role name', () => {

        const nonUniqueRoleDoc = sampleRoleContext.unpersisted[role.modelName][1];

        it('Should not persist a role with a non unique role name', async () => {
            const duplicateRole = new Role(nonUniqueRoleDoc);
            await expect(duplicateRole.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
        
    });
    
    describe('[db/models/role] - unique role name', () => {
    
        const uniqueRoleDoc = sampleRoleContext.unpersisted[role.modelName][0];

        it('Should persist a role with a unique role name', async () => {
            const uniqueRole = new Role(uniqueRoleDoc);
            await expect(uniqueRole.save()).to.eventually.be.eql(uniqueRole);
        });
        
    });

    afterEach(db.teardown(sampleRoleContextModelNames));

});

describe('[db/models/role] - singleUserRole context', () => {

    beforeEach(db.init(singleUserRoleContext.persisted));

    describe('[db/models/role] - Pre remove hook', () => {

        const persistedRoleId = singleUserRoleContext.persisted[role.modelName][0]._id;

        it('Should remove user-role association upon role deletion', async () => {

            const role = await Role.findOne({ _id: persistedRoleId });
            await role.remove();

            const userRoleDocCount = await UserRole.countDocuments({});
            expect(userRoleDocCount).to.equal(0);

        });

    });

    afterEach(db.teardown(singleUserRoleContextModelNames));

});
