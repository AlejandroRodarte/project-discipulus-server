const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

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

const [parentDoc, studentDoc] = fixtures.functions.models.generateFakeUsers(2, {
    fakeToken: true
});

let parentStudent = new db.models.ParentStudent(parentStudentDoc);
let parent = new db.models.User(parentDoc);
let student = new db.models.User(studentDoc);
let parentStudentInvitation = new db.models.ParentStudentInvitation(parentStudentInvitationDoc);

beforeEach(() => {
    parentStudent = fixtures.functions.models.getNewModelInstance(db.models.ParentStudent, parentStudentDoc);
    parent = fixtures.functions.models.getNewModelInstance(db.models.User, parentDoc);
    student = fixtures.functions.models.getNewModelInstance(db.models.User, studentDoc);
    parentStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ParentStudentInvitation, parentStudentInvitationDoc);
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

        const sameIdParentStudent = new db.models.ParentStudent(sameIdParentStudentDoc);

        await expect(sameIdParentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfAssociation);

    });

    it('Should call User.findByIdAndValidateRole with correct args and throw error when it throws error', async () => {

        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').rejects();
        
        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentStudent.parent, util.roles.ROLE_PARENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notAParent
        });

    });

    it('Should throw error if second User.findByIdAndValidateRole call (with correct args) throws error to a student user', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().rejects();

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledWith(userFindByIdAndValidateRole.secondCall, parentStudent.student, util.roles.ROLE_STUDENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if an associated parent-student invitation is not found (with correct args)', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);

        parentStudentInvitationFindOneStub = sinon.stub(db.models.ParentStudentInvitation, 'findOne').resolves(null);

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.parentStudentInvitationRequired);

        sinon.assert.calledOnceWithExactly(parentStudentInvitationFindOneStub, {
            parent: parentStudent.parent,
            student: parentStudent.student
        });

    });

    it('Should throw error on save if ParentStudent model validation rules fail', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);

        parentStudentInvitationFindOneStub = sinon.stub(db.models.ParentStudentInvitation, 'findOne').resolves(parentStudentInvitation);

        parentStudentInvitationRemoveStub = sinon.stub(parentStudentInvitation, 'remove').resolves();
        parentStudentSaveStub = sinon.stub(parentStudent, 'save').rejects();

        await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentStudentSaveStub);

    });

    it('Should return parentStudent instance model when validations pass and parent-student-invitation gets removed', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(parent)
                 .onSecondCall().resolves(student);

        parentStudentInvitationFindOneStub = sinon.stub(db.models.ParentStudentInvitation, 'findOne').resolves(parentStudentInvitation);

        parentStudentInvitationRemoveStub = sinon.stub(parentStudentInvitation, 'remove').resolves();
        parentStudentSaveStub = sinon.stub(parentStudent, 'save').resolves(parentStudent);

        await expect(parentStudent.checkAndSave()).to.eventually.be.eql(parentStudent);

        sinon.assert.calledOnce(parentStudentInvitationRemoveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
