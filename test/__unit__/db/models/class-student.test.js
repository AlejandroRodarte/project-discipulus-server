const { Types } = require('mongoose');
const faker = require('faker');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { ClassStudent, User, Class, ClassStudentInvitation, ClassUnknownStudentInvitation } = require('../../../../src/db/models');
const { classStudentDefinition } = require('../../../../src/db/schemas/class-student');
const modelFunctions = require('../../../__fixtures__/functions/models');

const { modelErrorMessages } = require('../../../../src/util/errors');
const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classStudentDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
};

const classStudentInvitationDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
};

const classUnknownStudentInvitationDoc = {
    class: new Types.ObjectId(),
    email: faker.internet.email()
};

const [studentDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const classDoc = {

    _id: new Types.ObjectId(),
    user: new Types.ObjectId(),

    ...modelFunctions.generateFakeClass({
        titleWords: 5,
        descriptionWords: 10,
        sessions: [[0, 10]]
    })

};

let classStudent = new ClassStudent(classStudentDoc);
let classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);
let classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);
let student = new User(studentDoc);
let clazz = new Class(classDoc);

beforeEach(() => {
    classStudent = modelFunctions.getNewModelInstance(ClassStudent, classStudentDoc);
    classStudentInvitation = modelFunctions.getNewModelInstance(ClassStudentInvitation, classStudentInvitationDoc);
    classUnknownStudentInvitation = modelFunctions.getNewModelInstance(ClassUnknownStudentInvitation, classUnknownStudentInvitationDoc);
    student = modelFunctions.getNewModelInstance(User, studentDoc);
    clazz = modelFunctions.getNewModelInstance(Class, classDoc);
});

describe('[db/models/class-student] - Invalid class', () => {

    it('Should not validate if class-student does not include a class _id', () => {
        classStudent.class = undefined;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.class.required);
    });

});

describe('[db/models/class-student] - Invalid user', () => {

    it('Should not validate if class-student does not include a user _id', () => {
        classStudent.user = undefined;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.user.required);
    });

});

describe('[db/models/class-student] - Default grade', () => {

    it('Should default grade to 0 if not specified', () => {
        expect(classStudent.grade).to.equal(0);
    });

});

describe('[db/models/class-student] - Invalid grade', () => {

    const [minGrade] = classStudentDefinition.grade.min;
    const [maxGrade] = classStudentDefinition.grade.max;

    it(`Should not validate grade lower than ${ minGrade }`, () => {
        classStudent.grade = -10;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.grade.min);
    });

    it(`Should not validate grade higher than ${ maxGrade }`, () => {
        classStudent.grade = 110;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.grade.max);
    });

});

describe('[db/models/class-student] - Default write', () => {

    it('Should default write flag to false', () => {
        expect(classStudent.write).to.equal(false);
    });

});

describe('[db/models/class-student] - Default archive', () => {

    it('Should default archive flag to false', () => {
        expect(classStudent.archive).to.equal(false);
    });

});

describe('[db/models/class-student] - Valid model', () => {

    it('Should validate correct class-student model', () => {
        modelFunctions.testForValidModel(classStudent);
    });

});

describe('[db/models/class-student] - methods.checkUser', () => {

    let userFindByIdAndValidateRoleStub;
    let classFindByIdAndCheckForSelfAssociationStub;

    it('Should throw error if User.findByIdAndValidateRole (with correct args) rejects', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').rejects();
        await expect(classStudent.checkUser()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, classStudent.user, roleTypes.ROLE_STUDENT, {
            notFoundErrorMessage: modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if Class.findByIdAndCheckForSelfAssociation (with correct args) rejects', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociationStub = sinon.stub(Class, 'findByIdAndCheckForSelfAssociation').rejects();

        await expect(classStudent.checkUser()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(classFindByIdAndCheckForSelfAssociationStub, {
            classId: classStudent.class,
            studentId: classStudent.user
        });

    });

    it('Should return checked user if all checks pass', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociationStub = sinon.stub(Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);

        await expect(classStudent.checkUser()).to.eventually.eql(student);

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class-student] - methods.checkKnownInvitationAndSave', () => {

    let classStudentCheckUserStub;
    let classStudentInvitationFindOneStub;
    let classStudentInvitationRemoveStub;
    let classStudentSaveStub;

    it('Should throw error if classStudent.checkUser fails', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').rejects();
        await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classStudentCheckUserStub);

    });

    it('Should throw error ClassStudentInvitation.findOne (called with correct args) resolves to null', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').resolves(student);
        classStudentInvitationFindOneStub = sinon.stub(ClassStudentInvitation, 'findOne').resolves(null);

        await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classStudentInvitationRequired);

        sinon.assert.calledOnceWithExactly(classStudentInvitationFindOneStub, {
            class: classStudent.class,
            user: classStudent.user
        });

    });

    it('Should remove class-student invitation and persist association if all checks pass', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').resolves(student);
        classStudentInvitationFindOneStub = sinon.stub(ClassStudentInvitation, 'findOne').resolves(classStudentInvitation);
        classStudentInvitationRemoveStub = sinon.stub(classStudentInvitation, 'remove').resolves();
        classStudentSaveStub = sinon.stub(classStudent, 'save').resolves();

        await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.eql(classStudent);

        sinon.assert.calledOnce(classStudentInvitationRemoveStub);
        sinon.assert.calledOnce(classStudentSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class-student] - methods.checkUnknownInvitationAndSave', () => {

    let classStudentCheckUserStub;
    let classUnknownStudentInvitationFindOneStub;
    let classUnknownStudentInvitationRemoveStub;
    let classStudentSaveStub;

    it('Should throw error if classStudent.checkUser fails', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').rejects();
        await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classStudentCheckUserStub);

    });

    it('Should throw error ClassUnknownStudentInvitation.findOne (called with correct args) resolves to null', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').resolves(student);
        classUnknownStudentInvitationFindOneStub = sinon.stub(ClassUnknownStudentInvitation, 'findOne').resolves(null);

        await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classUnknownStudentInvitationRequired);

        sinon.assert.calledOnceWithExactly(classUnknownStudentInvitationFindOneStub, {
            class: classStudent.class,
            email: student.email
        });

    });

    it('Should remove class-student invitation and persist association if all checks pass', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').resolves(student);
        classUnknownStudentInvitationFindOneStub = sinon.stub(ClassUnknownStudentInvitation, 'findOne').resolves(classUnknownStudentInvitation);
        classUnknownStudentInvitationRemoveStub = sinon.stub(classUnknownStudentInvitation, 'remove').resolves();
        classStudentSaveStub = sinon.stub(classStudent, 'save').resolves();

        await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.eql(classStudent);

        sinon.assert.calledOnce(classUnknownStudentInvitationRemoveStub);
        sinon.assert.calledOnce(classStudentSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
