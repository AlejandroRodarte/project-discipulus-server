const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const util = require('../../../../../src/util');
const shared = require('../../../../../src/shared');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userRoleDoc = {
    user: new Types.ObjectId(),
    role: new Types.ObjectId()
};

let userRole = new db.models.UserRole(userRoleDoc);

const args = {
    left: {
        modelName: shared.db.names.user.modelName,
        ref: 'user',
        errorMessage: util.errors.modelErrorMessages.userNotFoundOrDisabled,
        extraCond: {
            enabled: true
        }
    },
    right: {
        modelName: shared.db.names.role.modelName,
        ref: 'role',
        errorMessage: util.errors.modelErrorMessages.roleNotFound,
        extraCond: {}
    }
};

beforeEach(() => userRole = fixtures.functions.models.getNewModelInstance(db.models.UserRole, userRoleDoc));

describe('[util/models/common/generate-joint-exists-validator] - general flow', () => {

    let userExistsStub;
    let roleExistsStub;

    it('Should throw error if LeftModel.exists (called with correct args) resolves to false', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(false);

        const validator = util.models.common.generateJointExistsValidator(args);
        await expect(validator(userRole)).to.eventually.be.rejectedWith(Error, args.left.errorMessage);

        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userRole[args.left.ref],
            ...args.left.extraCond
        });

    });

    it('Should throw error if RightModel.exists (called with correct args) resolves to false', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        roleExistsStub = sinon.stub(db.models.Role, 'exists').resolves(false);

        const validator = util.models.common.generateJointExistsValidator(args);
        await expect(validator(userRole)).to.eventually.be.rejectedWith(Error, args.right.errorMessage);

        sinon.assert.calledOnceWithExactly(roleExistsStub, {
            _id: userRole[args.right.ref],
            ...args.right.extraCond
        });

    });

    it('Should fulfill promise if all tasks resolve', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        roleExistsStub = sinon.stub(db.models.Role, 'exists').resolves(true);

        const validator = util.models.common.generateJointExistsValidator(args);
        await expect(validator(userRole)).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
