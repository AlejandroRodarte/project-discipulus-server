const { Types } = require('mongoose');
const faker = require('faker');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { ClassUnknownStudentInvitation, ClassStudentInvitation, User } = require('../../../../src/db/models');
const { classUnknownStudentInvitationDefinition } = require('../../../../src/db/schemas/class-unknown-student-invitation');
const modelFunctions = require('../../../__fixtures__/functions/models');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classUnknownStudentInvitationDoc = {
    class: new Types.ObjectId(),
    email: faker.internet.email()
};

const classStudentInvitationDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
};

const [studentDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

let classUnknownStudentInvitation = new ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);
let classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);
let student = new User(studentDoc);

beforeEach(() => {
    classUnknownStudentInvitation = modelFunctions.getNewModelInstance(ClassUnknownStudentInvitation, classUnknownStudentInvitationDoc);
    classStudentInvitation = modelFunctions.getNewModelInstance(ClassStudentInvitation, classStudentInvitationDoc);
    student = modelFunctions.getNewModelInstance(User, studentDoc);
});

describe('[db/models/class-unknown-student-invitation] - Invalid class', () => {

    it('Should not validate if class _id is undefined', () => {
        classUnknownStudentInvitation.class = undefined;
        modelFunctions.testForInvalidModel(classUnknownStudentInvitation, classUnknownStudentInvitationDefinition.class.required);
    });

});

describe('[db/models/class-unknown-student-invitation] - Invalid email', () => {

    it('Should not validate if email is undefined', () => {
        classUnknownStudentInvitation.email = undefined;
        modelFunctions.testForInvalidModel(classUnknownStudentInvitation, classUnknownStudentInvitationDefinition.email.required);
    });

    it('Should not validate if email is not formatted properly', () => {
        classUnknownStudentInvitation.email = 'not-an@@-email.com.mx';
        modelFunctions.testForInvalidModel(classUnknownStudentInvitation, classUnknownStudentInvitationDefinition.email.validate);
    });

});

describe('[db/models/class-unknown-student-invitation] - Valid email', () => {

    it('Should trim valid email', () => {
        
        classUnknownStudentInvitation.email = '   super-email@somewhere.gov  ';
        modelFunctions.testForValidModel(classUnknownStudentInvitation);
    
        expect(classUnknownStudentInvitation.email).to.equal('super-email@somewhere.gov');
    
    });

});


describe('[db/models/class-unknown-student-invitation] - Valid model', () => {

    it('Should validate correct class-unknown-student invitation model', () => {
        modelFunctions.testForValidModel(classUnknownStudentInvitation);
    })

});

describe('[db/models/class-unknown-student-invitation] - methods.checkAndSave', () => {

    let userFindOneStub;
    let classStudentInvitationCheckAndSaveStub;
    let classUnknownStudentInvitationSaveStub;

    it('Should throw error if User.findOne (called with correct args) finds a user, a regular invitation is made but checkAndSave fails', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(student);
        classStudentInvitationCheckAndSaveStub = sinon.stub(ClassStudentInvitation.prototype, 'checkAndSave').rejects();

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            email: classUnknownStudentInvitation.email
        });

        sinon.assert.calledOnce(classStudentInvitationCheckAndSaveStub);

    });

    it('Should return class-student invitation instance if regular invitation checkAndSave resolves', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(student);
        classStudentInvitationCheckAndSaveStub = sinon.stub(ClassStudentInvitation.prototype, 'checkAndSave').resolves(classStudentInvitation);

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.include({
            class: classUnknownStudentInvitation.class,
            user: student._id
        });

    });

    it('Should throw error if classUnknownStudentInvitation.save fails', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        classUnknownStudentInvitationSaveStub = sinon.stub(classUnknownStudentInvitation, 'save').rejects();

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classUnknownStudentInvitationSaveStub);

    });

    it('Should return class-unknown-student invitation on success', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        classUnknownStudentInvitationSaveStub = sinon.stub(classUnknownStudentInvitation, 'save').resolves(classUnknownStudentInvitation);

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.eql(classUnknownStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
