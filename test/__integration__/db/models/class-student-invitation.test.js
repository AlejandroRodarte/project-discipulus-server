const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-invitation] - uniqueClassStudentInvitation context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassStudentInvitationContext.persisted));

    const unpersistedClassStudentInvitations = fixtures.models.uniqueClassStudentInvitationContext.unpersisted[shared.db.names.classStudentInvitation.modelName];

    describe('[db/models/class-student-invitation] - class/user index', () => {

        it('Should fail on same class/user _id combo', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[0];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);
            
            await expect(classStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different user', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[1];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

        it('Should persist on same user but different class', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[2];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

        it('Should persist on different class/user ids', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[3];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassStudentInvitationContext.persisted));

});

describe('[db/models/class-student-invitation] - baseClassStudentInvitation context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassStudentInvitationContext.persisted));

    describe('[db/models/class-student-invitation] - methods.checkAndSave', () => {

        const unpersistedClassStudentInvitations = fixtures.models.baseClassStudentInvitationContext.unpersisted[shared.db.names.classStudentInvitation.modelName];

        it('Should not persist if invited student does not exist', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[0];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if invited student has its account disabled', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[1];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if invited student is not a student', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[2];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.notAStudent);

        });

        it('Should not persist if class does not exist', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[3];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not persist if class teacher _id matches invited student _id', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[4];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfTeaching);

        });

        it('Should not persist if a class-student association already exists', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[5];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentAlreadyExists);

        });

        it('Should not persist if class-student invitation fails validation (non-unique, already invited)', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[6];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly persist a correct class-student invitation', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[7];
            const classStudentInvitation = new db.models.ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.eql(classStudentInvitation);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassStudentInvitationContext.persisted));

});
