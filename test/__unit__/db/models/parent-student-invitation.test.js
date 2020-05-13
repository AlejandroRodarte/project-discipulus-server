const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { generateFakeUsers, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { User, ParentStudentInvitation, ParentStudent } = require('../../../../src/db/models');

const roleTypes = require('../../../../src/util/roles');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const parentStudentInvitationDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

const [studentDoc, parentDoc] = generateFakeUsers(2, {
    fakeToken: true
});

let parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);
let student = new User(studentDoc);
let parent = new User(parentDoc);

beforeEach(() => {
    parentStudentInvitation = getNewModelInstance(ParentStudentInvitation, parentStudentInvitationDoc);
    student = getNewModelInstance(User, studentDoc);
    parent = getNewModelInstance(User, parentDoc);
});

describe('[db/models/parent-student-invitation] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRole;
    let parentStudentExistsStub;
    let parentStudentInvitationSaveStub;

    it('Should throw an error if parentStudentInvitationDoc has same ids', async () => {

        const sameIdParentStudentInvitationDoc = {
            parent: parentStudentInvitation.student,
            student: parentStudentInvitation.student
        };

        const sameIdParentStudentInvitation = new ParentStudentInvitation(sameIdParentStudentInvitationDoc);

        await expect(sameIdParentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfAssociation);

    });

    it('Should call User.findByIdAndValidateRole with correct args and throw error when it throws error', async () => {

        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').rejects();
        
        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentStudentInvitation.student, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if second User.findByIdAndValidateRole call (with correct args) resolves null to a parent user', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().rejects();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledWith(userFindByIdAndValidateRole.secondCall, parentStudentInvitation.parent, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAParent
        });

    });

    it('Should throw error if there is already a parent-student association between both users (called with correct args)', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        parentStudentExistsStub = sinon.stub(ParentStudent, 'exists').resolves(true);

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(parentStudentExistsStub, {
            parent: parentStudentInvitation.parent,
            student: parentStudentInvitation.student
        });

    });

    it('Should throw error on save if ParentStudentInvitation model validation rules fail', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        parentStudentExistsStub = sinon.stub(ParentStudent, 'exists').resolves(false);
        parentStudentInvitationSaveStub = sinon.stub(parentStudentInvitation, 'save').rejects();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentStudentInvitationSaveStub);

    });

    it('Should return parentStudentInvitation instance model when validations pass', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        parentStudentExistsStub = sinon.stub(ParentStudent, 'exists').resolves(false);
        parentStudentInvitationSaveStub = sinon.stub(parentStudentInvitation, 'save').resolves();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.eql(parentStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
