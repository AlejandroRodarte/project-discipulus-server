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

    let userFindOneStub;
    let studentHasRoleStub;
    let parentHasRoleStub;
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

    it('Should call User.findOne with correct args and throw error when resolves null user', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        
        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);
    
        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: parentStudentInvitation.student,
            enabled: true
        });

    });

    it('Should call student.hasRole with correct args and throw error when resolves to false', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(student);
        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(false);

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAStudent);

        sinon.assert.calledOnceWithExactly(studentHasRoleStub, roleTypes.ROLE_STUDENT);

    });

    it('Should throw error if second User.findOne call (with correct args) resolves null to a parent user', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(null);

        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);    

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentNotFound);

        sinon.assert.calledWith(userFindOneStub.secondCall, {
            _id: parentStudentInvitation.parent,
            enabled: true
        });

    });

    it('Should throw error if parent.hasRole resolves to false', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(false);

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAParent);

        sinon.assert.calledOnceWithExactly(parentHasRoleStub, roleTypes.ROLE_PARENT);

    });

    it('Should throw error if there is already a parent-student association between both users (called with correct args)', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);

        parentStudentExistsStub = sinon.stub(ParentStudent, 'exists').resolves(true);

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentStudentAlreadyExists);

        sinon.assert.calledOnceWithExactly(parentStudentExistsStub, {
            parent: parentStudentInvitation.parent,
            student: parentStudentInvitation.student
        });

    });

    it('Should throw error on save if ParentStudentInvitation model validation rules fail', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);

        parentStudentExistsStub = sinon.stub(ParentStudent, 'exists').resolves(false);
        parentStudentInvitationSaveStub = sinon.stub(parentStudentInvitation, 'save').rejects();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentStudentInvitationSaveStub);

    });

    it('Should return parentStudentInvitation instance model when validations pass', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);

        parentStudentExistsStub = sinon.stub(ParentStudent, 'exists').resolves(false);
        parentStudentInvitationSaveStub = sinon.stub(parentStudentInvitation, 'save').resolves();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.eql(parentStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
