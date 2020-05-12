const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { generateFakeUsers, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { User, ParentStudent, ParentStudentInvitation } = require('../../../../src/db/models');

const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const parentStudentDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

const parentStudentInvitationDoc = {
    parent: parentStudentDoc.parent,
    student: parentStudentDoc.student
};

const [parentDoc, studentDoc] = generateFakeUsers(2, {
    fakeToken: true
});

let parentStudent = new ParentStudent(parentStudentDoc);
let parent = new User(parentDoc);
let student = new User(studentDoc);
let parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

beforeEach(() => {
    parentStudent = getNewModelInstance(ParentStudent, parentStudentDoc);
    parent = getNewModelInstance(User, parentDoc);
    student = getNewModelInstance(User, studentDoc);
    parentStudentInvitation = getNewModelInstance(ParentStudentInvitation, parentStudentInvitationDoc);
});

describe('[db/models/parent-student] - methods.checkAndSave', () => {

    let userFindOneStub;
    let parentHasRoleStub;
    let studentHasRoleStub;
    let parentStudentSaveStub;
    let parentStudentInvitationFindOneStub;
    let parentStudentInvitationRemoveStub;

    it('Should throw an error if parentStudentDoc has same ids', async () => {

        const sameIdParentStudentDoc = {
            parent: parentStudent.parent,
            student: parentStudent.parent
        };

        const sameIdParentStudent = new ParentStudent(sameIdParentStudentDoc);

        await expect(sameIdParentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

    });

    it('Should call User.findOne with correct args and throw error when resolves null parent user', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        
        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: parentStudent.parent,
            enabled: true
        });

    });

    it('Should call parent.hasRole with correct args and throw error when resolves to false', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(parent);
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(false);

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(parentHasRoleStub, roleTypes.ROLE_PARENT);

    });

    it('Should throw error if second User.findOne call (with correct args) resolves null to a student user', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(null);
                 
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledWith(userFindOneStub.secondCall, {
            _id: parentStudent.student,
            enabled: true
        });

    });

    it('Should throw error if second user is found but is not a student', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);
                 
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);
        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(false);

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(studentHasRoleStub, roleTypes.ROLE_STUDENT);

    });

    it('Should throw error if an associated parent-student invitation is not found (with correct args)', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);
                 
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);
        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);

        parentStudentInvitationFindOneStub = sinon.stub(ParentStudentInvitation, 'findOne').resolves(null);

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(parentStudentInvitationFindOneStub, {
            parent: parentStudent.parent,
            student: parentStudent.student
        });

    });

    it('Should throw error on save if ParentStudent model validation rules fail', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);
                 
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);
        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);

        parentStudentInvitationFindOneStub = sinon.stub(ParentStudentInvitation, 'findOne').resolves(parentStudentInvitation);

        parentStudentSaveStub = sinon.stub(parentStudent, 'save').rejects();

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentStudentSaveStub);

    });

    it('Should return parentStudent instance model when validations pass and parent-student-invitation gets removed', async () => {

        userFindOneStub = 
            sinon.stub(User, 'findOne')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);
                 
        parentHasRoleStub = sinon.stub(parent, 'hasRole').resolves(true);
        studentHasRoleStub = sinon.stub(student, 'hasRole').resolves(true);

        parentStudentInvitationFindOneStub = sinon.stub(ParentStudentInvitation, 'findOne').resolves(parentStudentInvitation);

        parentStudentSaveStub = sinon.stub(parentStudent, 'save').resolves(parentStudent);
        parentStudentInvitationRemoveStub = sinon.stub(parentStudentInvitation, 'remove').resolves();

        await expect(parentStudent.checkAndSave()).to.eventually.be.eql(parentStudent);

        sinon.assert.calledOnce(parentStudentInvitationRemoveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
