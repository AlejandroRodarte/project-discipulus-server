const { Types } = require('mongoose');
const faker = require('faker');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

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

const [studentDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

const classDoc = {

    _id: new Types.ObjectId(),
    user: new Types.ObjectId(),

    ...fixtures.functions.models.generateFakeClass({
        titleWords: 5,
        descriptionWords: 10,
        timeRanges: [[0, 10]]
    })

};

let classStudent = new db.models.ClassStudent(classStudentDoc);
let classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);
let classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);
let student = new db.models.User(studentDoc);
let clazz = new db.models.Class(classDoc);

beforeEach(() => {
    classStudent = fixtures.functions.models.getNewModelInstance(db.models.ClassStudent, classStudentDoc);
    classStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ClassStudentInvitation, classStudentInvitationDoc);
    classUnknownStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ClassUnknownStudentInvitation, classUnknownStudentInvitationDoc);
    student = fixtures.functions.models.getNewModelInstance(db.models.User, studentDoc);
    clazz = fixtures.functions.models.getNewModelInstance(db.models.Class, classDoc);
});

describe('[db/models/class-student] - Invalid class', () => {

    it('Should not validate if class-student does not include a class _id', () => {
        classStudent.class = undefined;
        fixtures.functions.models.testForInvalidModel(classStudent, db.schemas.definitions.classStudentDefinition.class.required);
    });

});

describe('[db/models/class-student] - Invalid user', () => {

    it('Should not validate if class-student does not include a user _id', () => {
        classStudent.user = undefined;
        fixtures.functions.models.testForInvalidModel(classStudent, db.schemas.definitions.classStudentDefinition.user.required);
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
        fixtures.functions.models.testForValidModel(classStudent);
    });

});

describe('[db/models/class-student] - methods.checkUser', () => {

    let userFindByIdAndValidateRoleStub;
    let classFindByIdAndCheckForSelfAssociationStub;

    it('Should throw error if User.findByIdAndValidateRole (with correct args) rejects', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').rejects();
        await expect(classStudent.checkUser()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, classStudent.user, util.roles.ROLE_STUDENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if Class.findByIdAndCheckForSelfAssociation (with correct args) rejects', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociationStub = sinon.stub(db.models.Class, 'findByIdAndCheckForSelfAssociation').rejects();

        await expect(classStudent.checkUser()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(classFindByIdAndCheckForSelfAssociationStub, {
            classId: classStudent.class,
            studentId: classStudent.user
        });

    });

    it('Should return checked user if all checks pass', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociationStub = sinon.stub(db.models.Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);

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
        classStudentInvitationFindOneStub = sinon.stub(db.models.ClassStudentInvitation, 'findOne').resolves(null);

        await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentInvitationRequired);

        sinon.assert.calledOnceWithExactly(classStudentInvitationFindOneStub, {
            class: classStudent.class,
            user: classStudent.user
        });

    });

    it('Should remove class-student invitation and persist association if all checks pass', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').resolves(student);
        classStudentInvitationFindOneStub = sinon.stub(db.models.ClassStudentInvitation, 'findOne').resolves(classStudentInvitation);
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
        classUnknownStudentInvitationFindOneStub = sinon.stub(db.models.ClassUnknownStudentInvitation, 'findOne').resolves(null);

        await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classUnknownStudentInvitationRequired);

        sinon.assert.calledOnceWithExactly(classUnknownStudentInvitationFindOneStub, {
            class: classStudent.class,
            email: student.email
        });

    });

    it('Should remove class-student invitation and persist association if all checks pass', async () => {

        classStudentCheckUserStub = sinon.stub(classStudent, 'checkUser').resolves(student);
        classUnknownStudentInvitationFindOneStub = sinon.stub(db.models.ClassUnknownStudentInvitation, 'findOne').resolves(classUnknownStudentInvitation);
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

describe('[db/models/class-student] - methods.isStudentEnabled', () => {

    let classStudentAggregateStub;

    it('Should throw error if isStudentEnabled pipeline returns no docs (no class-student doc exists)', async () => {

        classStudentAggregateStub = sinon.stub(db.models.ClassStudent, 'aggregate').resolves([]);
        await expect(classStudent.isStudentEnabled()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentNotFound);

        sinon.assert.calledOnceWithExactly(classStudentAggregateStub, shared.db.aggregation.classStudentPipelines.isStudentEnabled(classStudent._id));

    });

    it('Should return student enabled flag on pipeline success', async () => {

        const classStudents = [
            {
                _id: new Types.ObjectId(),
                enabled: true
            }
        ];

        classStudentAggregateStub = sinon.stub(db.models.ClassStudent, 'aggregate').resolves(classStudents);
        await expect(classStudent.isStudentEnabled()).to.eventually.equal(classStudents[0].enabled);

    });

    afterEach(() => {
        sinon.restore();
    });

});
