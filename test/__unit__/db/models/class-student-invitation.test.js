const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classStudentInvitationDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
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

let classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);
let clazz = new db.models.Class(classDoc);
let student = new db.models.User(studentDoc);

beforeEach(() => {
    classStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ClassStudentInvitation, classStudentInvitationDoc);
    clazz = fixtures.functions.models.getNewModelInstance(db.models.Class, classDoc);
    student = fixtures.functions.models.getNewModelInstance(db.models.User, studentDoc);
});

describe('[db/models/class-student-invitation] - Invalid class', () => {

    it('Should not validate if class _id is undefined', () => {
        classStudentInvitation.class = undefined;
        fixtures.functions.models.testForInvalidModel(classStudentInvitation, db.schemas.definitions.classStudentInvitationDefinition.class.required);
    });

});

describe('[db/models/class-student-invitation] - Invalid user', () => {

    it('Should not validate if user _id is undefined', () => {
        classStudentInvitation.user = undefined;
        fixtures.functions.models.testForInvalidModel(classStudentInvitation, db.schemas.definitions.classStudentInvitationDefinition.user.required);
    });

});

describe('[db/models/class-student-invitation] - Valid model', () => {

    it('Should validate correct class-student invitation model', () => {
        fixtures.functions.models.testForValidModel(classStudentInvitation);
    })

});

describe('[db/models/class-student-invitation] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRoleStub;
    let classFindByIdAndCheckForSelfAssociation;
    let classStudentExistsStub;
    let classStudentInvitationSaveStub;

    it('Should throw error if user.findByIdAndValidateRoleStub (with correct args) throws error on student search', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').rejects();
        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, classStudentInvitation.user, util.roles.ROLE_STUDENT, {
            notFoundErrorMessage: util.errors.modelErrorMessages.studentNotFound,
            invalidRoleErrorMessage: util.errors.modelErrorMessages.notAStudent
        });

    });

    it('Should throw error if Class.findByIdAndCheckForSelfAssociation (called with correct args) rejects', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(db.models.Class, 'findByIdAndCheckForSelfAssociation').rejects();

        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(classFindByIdAndCheckForSelfAssociation, {
            classId: classStudentInvitation.class,
            studentId: classStudentInvitation.user
        });

    });

    it('Should throw error if ClassStudent.exists (called with correct args) resolvs to true (student already associated to class)', async () => {

        clazz.user = new Types.ObjectId();

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(db.models.Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);
        classStudentExistsStub = sinon.stub(db.models.ClassStudent, 'exists').resolves(true);

        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentAlreadyExists);

        sinon.assert.calledOnceWithExactly(classStudentExistsStub, {
            class: classStudentInvitation.class,
            user: classStudentInvitation.user
        });

    });

    it('Should throw error if classStudentInvitation.save happens to fail', async () => {

        clazz.user = new Types.ObjectId();

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(db.models.Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);
        classStudentExistsStub = sinon.stub(db.models.ClassStudent, 'exists').resolves(false);
        classStudentInvitationSaveStub = sinon.stub(classStudentInvitation, 'save').rejects();

        await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classStudentInvitationSaveStub);

    });

    it('Should return class student invitation instance if all required checks pass', async () => {

        clazz.user = new Types.ObjectId();

        userFindByIdAndValidateRoleStub = sinon.stub(db.models.User, 'findByIdAndValidateRole').resolves(student);
        classFindByIdAndCheckForSelfAssociation = sinon.stub(db.models.Class, 'findByIdAndCheckForSelfAssociation').resolves(clazz);
        classStudentExistsStub = sinon.stub(db.models.ClassStudent, 'exists').resolves(false);
        classStudentInvitationSaveStub = sinon.stub(classStudentInvitation, 'save').resolves(classStudentInvitation);

        await expect(classStudentInvitation.checkAndSave()).to.eventually.eql(classStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
