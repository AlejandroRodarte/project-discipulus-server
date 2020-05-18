const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const parentStudentInvitationDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

const [studentDoc, parentDoc] = fixtures.functions.models.generateFakeUsers(2, {
    fakeToken: true
});

let parentStudentInvitation = new db.models.ParentStudentInvitation(parentStudentInvitationDoc);
let student = new db.models.User(studentDoc);
let parent = new db.models.User(parentDoc);

beforeEach(() => {
    parentStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ParentStudentInvitation, parentStudentInvitationDoc);
    student = fixtures.functions.models.getNewModelInstance(db.models.User, studentDoc);
    parent = fixtures.functions.models.getNewModelInstance(db.models.User, parentDoc);
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

        const sameIdParentStudentInvitation = new db.models.ParentStudentInvitation(sameIdParentStudentInvitationDoc);

        await expect(sameIdParentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfAssociation);

    });

    it('Should call User.findByIdAndValidateRole with correct args and throw error when it throws error', async () => {

        userFindByIdAndValidateRole = sinon.stub(db.models.User, 'findByIdAndValidateRole').rejects();
        
        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRole, parentStudentInvitation.student, util.roles.ROLE_STUDENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if second User.findByIdAndValidateRole call (with correct args) resolves null to a parent user', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().rejects();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledWith(userFindByIdAndValidateRole.secondCall, parentStudentInvitation.parent, util.roles.ROLE_PARENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.parentNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notAParent
        });

    });

    it('Should throw error if there is already a parent-student association between both users (called with correct args)', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        parentStudentExistsStub = sinon.stub(db.models.ParentStudent, 'exists').resolves(true);

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(parentStudentExistsStub, {
            parent: parentStudentInvitation.parent,
            student: parentStudentInvitation.student
        });

    });

    it('Should throw error on save if ParentStudentInvitation model validation rules fail', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        parentStudentExistsStub = sinon.stub(db.models.ParentStudent, 'exists').resolves(false);
        parentStudentInvitationSaveStub = sinon.stub(parentStudentInvitation, 'save').rejects();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(parentStudentInvitationSaveStub);

    });

    it('Should return parentStudentInvitation instance model when validations pass', async () => {

        userFindByIdAndValidateRole = 
            sinon.stub(db.models.User, 'findByIdAndValidateRole')
                 .onFirstCall().resolves(student)
                 .onSecondCall().resolves(parent);

        parentStudentExistsStub = sinon.stub(db.models.ParentStudent, 'exists').resolves(false);
        parentStudentInvitationSaveStub = sinon.stub(parentStudentInvitation, 'save').resolves();

        await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.eql(parentStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
