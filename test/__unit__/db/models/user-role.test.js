const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userRoleDoc = {
    role: new Types.ObjectId(),
    user: new Types.ObjectId()
};

let userRole = new db.models.UserRole(userRoleDoc);

beforeEach(() => userRole = fixtures.functions.models.getNewModelInstance(db.models.UserRole, userRoleDoc));

describe('[db/models/user-role] - invalid role', () => {

    it('Should not validate user-role if a role id is not defined', () => {
        userRole.role = undefined;
        fixtures.functions.models.testForInvalidModel(userRole, db.schemas.definitions.userRoleDefinition.role.required);
    });

});

describe('[db/models/user-role] - invalid user', () => {

    it('Should not validate user-role if a user id is not defined', () => {
        userRole.user = undefined;
        fixtures.functions.models.testForInvalidModel(userRole, db.schemas.definitions.userRoleDefinition.user.required);
    });

});

describe('[db/models/user-role] - valid user-role', () => {

    it('Should validate user-role with correct ids', () => {
        fixtures.functions.models.testForValidModel(userRole);
    });

});

describe('[db/models/user-role] - methods.checkAndSave', () => {

    let userExistsStub;
    let roleExistsStub;
    let userRoleSaveStub;

    it('Should throw error if User.exists (called with correct args) resolves false', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(false);
        await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userRole.user,
            enabled: true
        });

    });

    it('Should throw error if Role.exists (called with correct args) resolves false', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        roleExistsStub = sinon.stub(db.models.Role, 'exists').resolves(false);

        await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.roleNotFound);

        sinon.assert.calledOnceWithExactly(roleExistsStub, {
            _id: userRole.role
        });

    });

    it('Should throw error if userRole.save fails', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        roleExistsStub = sinon.stub(db.models.Role, 'exists').resolves(false);
        userRoleSaveStub = sinon.stub(userRole, 'save').rejects();

        await expect(userRole.checkAndSave()).to.eventually.be.rejectedWith(Error);

    });

    it('Should return user-role instance if all tasks resolve', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        roleExistsStub = sinon.stub(db.models.Role, 'exists').resolves(true);
        userRoleSaveStub = sinon.stub(userRole, 'save').resolves(userRole);

        await expect(userRole.checkAndSave()).to.eventually.eql(userRole);
        sinon.assert.calledOnce(userRoleSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });
    
});
