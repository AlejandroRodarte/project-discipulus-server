const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-unknown-student-invitation] - uniqueClassUnknownStudentInvitation context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassUnknownStudentInvitationContext.persisted));

    const unpersistedClassUnknownStudentInvitations = fixtures.models.uniqueClassUnknownStudentInvitationContext.unpersisted[shared.db.names.classUnknownStudentInvitation.modelName];

    describe('[db/models/class-unknown-student-invitation] - class/email index', () => {

        it('Should fail on same class/email combo', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[0];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);
            
            await expect(classUnknownStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different email', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[1];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.save()).to.eventually.eql(classUnknownStudentInvitation);

        });

        it('Should persist on same email but different class', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[2];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.save()).to.eventually.eql(classUnknownStudentInvitation);

        });

        it('Should persist on different class/email combo', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[3];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.save()).to.eventually.eql(classUnknownStudentInvitation);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassUnknownStudentInvitationContext.persisted));

});

describe('[db/models/class-unknown-student-invitation] - baseClassUnknownStudentInvitation context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassUnknownStudentInvitationContext.persisted));
    
    describe('[db/models/class-unknown-student-invitation] - methods.checkAndSave', () => {

        const unpersistedClassUnknownStudentInvitations = fixtures.models.baseClassUnknownStudentInvitationContext.unpersisted[shared.db.names.classUnknownStudentInvitation.modelName];

        it('Should not persist if the class is not found', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[0];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not persist if saving the invitation fails (non-unique class/email)', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[1];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist class-unknown-student invitation if its valid', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[2];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.eql(classUnknownStudentInvitation);

        });

        it('Should not persist if a user is actually found but its account is disabled', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[3];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if a user is actually found but its not a student', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[4];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.notAStudent);

        });

        it('Should not persist if a user is actually found but the class is not found', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[5];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not persist if a user is actually found but the teacher and student ids match', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[6];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfTeaching);

        });

        it('Should not persist if a user is actually found but already associated to the class', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[7];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentAlreadyExists);

        });

        it('Should not persist if a user is actually found but already has an invitation (non-unique)', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[8];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist a normal invitation if a user is actually found', async () => {

            const classUnknownStudentInvitationDoc = unpersistedClassUnknownStudentInvitations[9];
            const classUnknownStudentInvitation = new db.models.ClassUnknownStudentInvitation(classUnknownStudentInvitationDoc);

            await expect(classUnknownStudentInvitation.checkAndSave()).to.eventually.be.instanceof(db.models.ClassStudentInvitation);

            const user = await db.models.User.findOne({ email: classUnknownStudentInvitation.email });

            const regularInvitationExists = await db.models.ClassStudentInvitation.exists({
                class: classUnknownStudentInvitation.class,
                user: user._id
            });

            expect(regularInvitationExists).to.equal(true);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassUnknownStudentInvitationContext.persisted));

});
