const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { generateUserAndRoleValidator } = require('../../../../../src/util/models/common');
const { generateFakeFile, getNewModelInstance, generateFakeUsers } = require('../../../../__fixtures__/functions/models');

const { User, ParentFile } = require('../../../../../src/db/models');

const roleTypes = require('../../../../../src/util/roles');
const { modelErrorMessages } = require('../../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = generateFakeUsers(1, { fakeToken: true });

const parentFileDoc = {
    user: userDoc._id,
    file: generateFakeFile()
};

let parentFile = new ParentFile(parentFileDoc);
let user = new User(userDoc);

beforeEach(() => {
    parentFile = getNewModelInstance(ParentFile, parentFileDoc);
    user = getNewModelInstance(User, userDoc);
});

describe('[util/models/common/generate-user-and-role-validator] - general flow', () => {

    let userFindByIdAndValidateRole;

    it('Returned function should throw error if User.findByIdAndValidateRole fails', async () => {

        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').rejects();

        const validatorFn = generateUserAndRoleValidator(roleTypes.ROLE_PARENT);

        await expect(validatorFn(parentFile)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentFile.user, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

    });

    it('Returned function should resolve if tasks resolve', async () => {

        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').resolves(user);

        const validatorFn = generateUserAndRoleValidator(roleTypes.ROLE_PARENT);
        await expect(validatorFn(parentFile)).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
