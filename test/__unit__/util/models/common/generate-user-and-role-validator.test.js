const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const util = require('../../../../../src/util');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const parentFileDoc = {
    user: userDoc._id,
    file: fixtures.functions.models.generateFakeFile()
};

let parentFile = new db.models.ParentFile(parentFileDoc);
let user = new db.models.User(userDoc);

beforeEach(() => {
    parentFile = fixtures.functions.models.getNewModelInstance(db.models.ParentFile, parentFileDoc);
    user = fixtures.functions.models.getNewModelInstance(db.models.User, userDoc);
});

describe('[util/models/common/generate-user-and-role-validator] - general flow', () => {

    let userFindByIdAndValidateRole;

    it('Returned function should throw error if User.findByIdAndValidateRole fails', async () => {

        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').rejects();

        const validatorFn = util.models.common.generateUserAndRoleValidator(util.roles.ROLE_PARENT);

        await expect(validatorFn(parentFile)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentFile.user, util.roles.ROLE_PARENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.fileStorePermissionDenied
        });

    });

    it('Returned function should resolve if tasks resolve', async () => {

        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(user);

        const validatorFn = util.models.common.generateUserAndRoleValidator(util.roles.ROLE_PARENT);
        await expect(validatorFn(parentFile)).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
