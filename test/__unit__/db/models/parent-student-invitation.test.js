const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { parentStudentInvitationDefinition } = require('../../../../src/db/schemas/parent-student-invitation');
const { testForInvalidModel, testForValidModel, generateFakeUsers, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { User, ParentStudentInvitation } = require('../../../../src/db/models');

const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const parentStudentInvitationDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

const [userDoc] = generateFakeUsers(1, {
    fakeToken: true
});

let parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);
let user = new User(userDoc);

beforeEach(() => {
    parentStudentInvitation = getNewModelInstance(ParentStudentInvitation, parentStudentInvitationDoc);
    user = getNewModelInstance(User, userDoc);
});

describe('[db/models/parent-student-invitation] - statics.add', () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    let userFindOneStub;
    let userHasRoleStub;
    let userSaveStub;

    it('Should throw an error if parentStudentInvitationDoc has same ids', async () => {

        const sameIdParentStudentInvitationDoc = {
            parent: parentStudentInvitation.student,
            student: parentStudentInvitation.student
        };

        await expect(ParentStudentInvitation.add(sameIdParentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

    });

    it('Should call User.findOne with correct args and throw error when resolves null user', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(null);
        
        await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: parentStudentInvitation.student,
            enabled: true
        });

    });

    it('Should call parent.hasRole with correct args and throw error when resolves to false', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(false);

        await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userHasRoleStub, roleTypes.ROLE_STUDENT);

    });

    it('Should throw error on save if ParentStudentInvitation model validation rules fail', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(true);
        userSaveStub = sandbox.stub(ParentStudentInvitation.prototype, 'save').rejects();

        await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(userSaveStub);

    });

    it('Should return parentStudentInvitation instance model when validations pass', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(true);
        userSaveStub = sandbox.stub(ParentStudentInvitation.prototype, 'save').resolves();

        await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.instanceof(ParentStudentInvitation);

    });

    afterEach(() => {
        sandbox.restore();
    });

});
