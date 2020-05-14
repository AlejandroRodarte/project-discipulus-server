const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { ClassStudentInvitation, ClassStudent, Class, User } = require('../../../../src/db/models');
const { classStudentInvitationDefinition } = require('../../../../src/db/schemas/class-student-invitation');
const modelFunctions = require('../../../__fixtures__/functions/models');

const { modelErrorMessages } = require('../../../../src/util/errors');
const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classStudentInvitationDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
};

const [studentDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const classDoc = {

    _id: new Types.ObjectId(),
    user: classStudentInvitationDoc.user,

    ...modelFunctions.generateFakeClass({
        titleWords: 5,
        descriptionWords: 10,
        sessions: [[0, 10]]
    })

};

let classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);
let clazz = new Class(classDoc);
let student = new User(studentDoc);

beforeEach(() => {
    classStudentInvitation = modelFunctions.getNewModelInstance(ClassStudentInvitation, classStudentInvitationDoc);
    clazz = modelFunctions.getNewModelInstance(Class, classDoc);
    student = modelFunctions.getNewModelInstance(User, studentDoc);
});

describe('[db/models/class-student-invitation] - Invalid class', () => {

    it('Should not validate if class _id is undefined', () => {
        classStudentInvitation.class = undefined;
        modelFunctions.testForInvalidModel(classStudentInvitation, classStudentInvitationDefinition.class.required);
    });

});

describe('[db/models/class-student-invitation] - Invalid user', () => {

    it('Should not validate if user _id is undefined', () => {
        classStudentInvitation.user = undefined;
        modelFunctions.testForInvalidModel(classStudentInvitation, classStudentInvitationDefinition.user.required);
    });

});

describe('[db/models/class-student-invitation] - Valid model', () => {

    it('Should validate correct class-student invitation model', () => {
        modelFunctions.testForValidModel(classStudentInvitation);
    })

});

describe('[db/models/class-student-invitation] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRoleStub;
    let classFindByIdAndCheckForSelfAssociation;
    let classStudentExistsStub;
    let classStudentInvitationSaveStub;

    it('Should throw error if user.findByIdAndValidateRoleStub (with correct args) throws error on student search', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').rejects();
        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, classStudentInvitation.user, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if Class.findByIdAndCheckForSelfAssociation (called with correct args) rejects', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(Class, 'findByIdAndCheckForSelfAssociation').rejects();

        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(classFindByIdAndCheckForSelfAssociation, {
            classId: classStudentInvitation.class,
            studentId: classStudentInvitation.user
        });

    });

    it('Should throw error if ClassStudent.exists (called with correct args) resolvs to true (student already associated to class)', async () => {

        clazz.user = new Types.ObjectId();

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);
        classStudentExistsStub = sinon.stub(ClassStudent, 'exists').resolves(true);

        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classStudentAlreadyExists);

        sinon.assert.calledOnceWithExactly(classStudentExistsStub, {
            class: classStudentInvitation.class,
            user: classStudentInvitation.user
        });

    });

    it('Should throw error if classStudentInvitation.save happens to fail', async () => {

        clazz.user = new Types.ObjectId();

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);
        classStudentExistsStub = sinon.stub(ClassStudent, 'exists').resolves(false);
        classStudentInvitationSaveStub = sinon.stub(classStudentInvitation, 'save').rejects();

        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classStudentInvitationSaveStub);

    });

    it('Should return class student invitation instance if all required checks pass', async () => {

        clazz.user = new Types.ObjectId();

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);
        classStudentExistsStub = sinon.stub(ClassStudent, 'exists').resolves(false);
        classStudentInvitationSaveStub = sinon.stub(classStudentInvitation, 'save').resolves(classStudentInvitation);

        await expect(classStudentInvitation.checkAndSave()).to.eventually.eql(classStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
