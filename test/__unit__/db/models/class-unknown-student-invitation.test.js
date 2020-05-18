const { Types } = require('mongoose');
const faker = require('faker');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

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

const [studentDoc] = fixtures.functions.models.generateFakeUsers(1, { fakeToken: true });

let classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);
let classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);
let student = new db.models.User(studentDoc);

beforeEach(() => {
    classUnknownStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ClassUnknownStudentInvitation, classUnknownStudentInvitationDoc);
    classStudentInvitation = fixtures.functions.models.getNewModelInstance(db.models.ClassStudentInvitation, classStudentInvitationDoc);
    student = fixtures.functions.models.getNewModelInstance(db.models.User, studentDoc);
});

describe('[db/models/class-unknown-student-invitation] - Invalid class', () => {

    it('Should not validate if class _id is undefined', () => {
        classUnknownStudentInvitation.class = undefined;
        fixtures.functions.models.testForInvalidModel(classUnknownStudentInvitation, db.schemas.definitions.classUnknownStudentInvitationDefinition.class.required);
    });

});

describe('[db/models/class-unknown-student-invitation] - Invalid email', () => {

    it('Should not validate if email is undefined', () => {
        classUnknownStudentInvitation.email = undefined;
        fixtures.functions.models.testForInvalidModel(classUnknownStudentInvitation, db.schemas.definitions.classUnknownStudentInvitationDefinition.email.required);
    });

    it('Should not validate if email is not formatted properly', () => {
        classUnknownStudentInvitation.email = 'not-an@@-email.com.mx';
        fixtures.functions.models.testForInvalidModel(classUnknownStudentInvitation, db.schemas.definitions.classUnknownStudentInvitationDefinition.email.validate);
    });

});

describe('[db/models/class-unknown-student-invitation] - Valid email', () => {

    it('Should trim valid email', () => {
        
        classUnknownStudentInvitation.email = '   super-email@somewhere.gov  ';
        fixtures.functions.models.testForValidModel(classUnknownStudentInvitation);
    
        expect(classUnknownStudentInvitation.email).to.equal('super-email@somewhere.gov');
    
    });

});


describe('[db/models/class-unknown-student-invitation] - Valid model', () => {

    it('Should validate correct class-unknown-student invitation model', () => {
        fixtures.functions.models.testForValidModel(classUnknownStudentInvitation);
    })

});

describe('[db/models/class-unknown-student-invitation] - methods.checkAndSave', () => {

    let userFindOneStub;
    let classStudentInvitationCheckAndSaveStub;
    let classUnknownStudentInvitationSaveStub;
    let classExistsStub;

    it('Should throw error if User.findOne (called with correct args) finds a user, a regular invitation is made but checkAndSave fails', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(student);
        classStudentInvitationCheckAndSaveStub = sinon.stub(db.models.ClassStudentInvitation.prototype, 'checkAndSave').rejects();

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            email: classUnknownStudentInvitation.email
        });

        sinon.assert.calledOnce(classStudentInvitationCheckAndSaveStub);

    });

    it('Should return class-student invitation instance if regular invitation checkAndSave resolves', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(student);
        classStudentInvitationCheckAndSaveStub = sinon.stub(db.models.ClassStudentInvitation.prototype, 'checkAndSave').resolves(classStudentInvitation);

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.include({
            class: classUnknownStudentInvitation.class,
            user: student._id
        });

    });

    it('Should throw error if user is indeed unknown but Class.exists (called with correct args) resolves false', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(null);
        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(false);

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        sinon.assert.calledOnceWithExactly(classExistsStub, {
            _id: classUnknownStudentInvitation.class
        });

    });

    it('Should throw error if classUnknownStudentInvitation.save fails', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(null);
        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(true);
        classUnknownStudentInvitationSaveStub = sinon.stub(classUnknownStudentInvitation, 'save').rejects();

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classUnknownStudentInvitationSaveStub);

    });

    it('Should return class-unknown-student invitation on success', async () => {

        userFindOneStub = sinon.stub(db.models.User, 'findOne').resolves(null);
        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(true);
        classUnknownStudentInvitationSaveStub = sinon.stub(classUnknownStudentInvitation, 'save').resolves(classUnknownStudentInvitation);

        await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.eql(classUnknownStudentInvitation);

    });

    afterEach(() => {
        sinon.restore();
    });

});
