const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { generateFakeUsers, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { User, ParentStudent, ParentStudentInvitation } = require('../../../../src/db/models');

const roleTypes = require('../../../../src/util/roles');

const { modelErrorMessages } = require('../../../../src/util/errors');

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

    let userFindByIdAndValidateRole;
    let parentStudentSaveStub;
    let parentStudentInvitationFindOneStub;
    let parentStudentInvitationRemoveStub;

    it('Should throw an error if parentStudentDoc has same ids', async () => {

        const sameIdParentStudentDoc = {
            parent: parentStudent.parent,
            student: parentStudent.parent
        };

        const sameIdParentStudent = new ParentStudent(sameIdParentStudentDoc);

        await expect(sameIdParentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfAssociation);

    });

    it('Should call User.findByIdAndValidateRole with correct args and throw error when it throws error', async () => {

        userFindByIdAndValidateRole = sinon.stub(User, 'findByIdAndValidateRole').rejects();
        
        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentStudent.parent, roleTypes.ROLE_PARENT, {
            notFoundErrorMessage: modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAParent
        });

    });

    it('Should throw error if second User.findByIdAndValidateRole call (with correct args) throws error to a student user', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().rejects();

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledWith(userFindByIdAndValidateRole.secondCall, parentStudent.student, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if an associated parent-student invitation is not found (with correct args)', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);

        parentStudentInvitationFindOneStub = sinon.stub(ParentStudentInvitation, 'findOne').resolves(null);

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentStudentInvitationRequired);

        sinon.assert.calledOnceWithExactly(parentStudentInvitationFindOneStub, {
            parent: parentStudent.parent,
            student: parentStudent.student
        });

    });

    it('Should throw error on save if ParentStudent model validation rules fail', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);

        parentStudentInvitationFindOneStub = sinon.stub(ParentStudentInvitation, 'findOne').resolves(parentStudentInvitation);

        parentStudentInvitationRemoveStub = sinon.stub(parentStudentInvitation, 'remove').resolves();
        parentStudentSaveStub = sinon.stub(parentStudent, 'save').rejects();

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentStudentSaveStub);

    });

    it('Should return parentStudent instance model when validations pass and parent-student-invitation gets removed', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);

        parentStudentInvitationFindOneStub = sinon.stub(ParentStudentInvitation, 'findOne').resolves(parentStudentInvitation);

        parentStudentInvitationRemoveStub = sinon.stub(parentStudentInvitation, 'remove').resolves();
        parentStudentSaveStub = sinon.stub(parentStudent, 'save').resolves(parentStudent);

        await expect(parentStudent.checkAndSave()).to.eventually.be.eql(parentStudent);

        sinon.assert.calledOnce(parentStudentInvitationRemoveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
