const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudentInvitation } = require('../../../../src/db/models');

const { uniqueClassStudentInvitationContext, baseClassStudentInvitationContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-invitation] - uniqueClassStudentInvitation context', () => {

    beforeEach(db.init(uniqueClassStudentInvitationContext.persisted));

    const unpersistedClassStudentInvitations = uniqueClassStudentInvitationContext.unpersisted[names.classStudentInvitation.modelName];

    describe('[db/models/class-student-invitation] - class/user index', () => {

        it('Should fail on same class/user _id combo', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[0];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);
            
            await expect(classStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different user', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[1];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

        it('Should persist on same user but different class', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[2];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

        it('Should persist on different class/user ids', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[3];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.save()).to.eventually.eql(classStudentInvitation);

        });

    });

    afterEach(db.teardown(uniqueClassStudentInvitationContext.persisted));

});

describe('[db/models/class-student-invitation] - baseClassStudentInvitation context', () => {

    beforeEach(db.init(baseClassStudentInvitationContext.persisted));

    describe('[db/models/class-student-invitation] - methods.checkAndSave', () => {

        const unpersistedClassStudentInvitations = baseClassStudentInvitationContext.unpersisted[names.classStudentInvitation.modelName];

        it('Should not persist if invited student does not exist', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[0];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should not persist if invited student has its account disabled', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[1];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should not persist if invited student is not a student', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[2];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAStudent);

        });

        it('Should not persist if class does not exist', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[3];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classNotFound);

        });

        it('Should not persist if class teacher _id matches invited student _id', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[4];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfTeaching);

        });

        it('Should not persist if a class-student association already exists', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[5];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classStudentAlreadyExists);

        });

        it('Should not persist if class-student invitation fails validation (non-unique, already invited)', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[6];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly persist a correct class-student invitation', async () => {

            const classStudentInvitationDoc = unpersistedClassStudentInvitations[7];
            const classStudentInvitation = new ClassStudentInvitation(classStudentInvitationDoc);

            await expect(classStudentInvitation.checkAndSave()).to.eventually.be.eql(classStudentInvitation);

        });

    });

    afterEach(db.teardown(baseClassStudentInvitationContext.persisted));

});
