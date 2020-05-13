const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const ParentStudentInvitation = require('../../../../src/db/models/parent-student-invitation');

const { baseParentStudentInvitationContext, uniqueParentStudentInvitationContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-student-invitation] - uniqueParentStudentInvitation context', () => {

    beforeEach(db.init(uniqueParentStudentInvitationContext.persisted));

    const unpersistedParentUserInvitations = uniqueParentStudentInvitationContext.unpersisted[names.parentStudentInvitation.modelName];

    describe('[db/models/parent-student-invitation] - Non-unique parent-students', async () => {

        const parentStudentInvitationDoc = unpersistedParentUserInvitations[3];

        it('Should not persist a parent-student-invitation that has the same user/role composite _id', async () => {
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);
            await expect(parentStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/parent-student-invitation] - Unique parent-students', () => {

        it('Should persist a parent-student-invitation with same parent _id and different student _id', async () => {
            
            const parentStudentInvitationDoc = unpersistedParentUserInvitations[0];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.save()).to.eventually.be.eql(parentStudentInvitation);

        });
    
        it('Should persist a parent-student-invitation with same student _id and different parent _id', async () => {
            
            const parentStudentInvitationDoc = unpersistedParentUserInvitations[1];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.save()).to.eventually.be.eql(parentStudentInvitation);

        });
    
        it('Should persist a parent-student-invitation with different parent and student _id', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[2];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.save()).to.eventually.be.eql(parentStudentInvitation);

        });

    });
        
    afterEach(db.teardown(uniqueParentStudentInvitationContext.persisted));

});

describe('[db/models/parent-student-invitation] - baseParentStudentInvitation context', () => {

    beforeEach(db.init(baseParentStudentInvitationContext.persisted));

    const unpersistedParentUserInvitations = baseParentStudentInvitationContext.unpersisted[names.parentStudentInvitation.modelName];

    describe('[db/models/parent-student-invitation] - methods.checkAndSave', () => {

        it('Should throw an error if parent and student id match', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[0];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfAssociation);

        });

        it('Should throw an error if a student account is deleted', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[1];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should throw an error if a student account is disabled', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[2];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should throw an error if student user id does not correspond to the user role', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[3];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAStudent);

        });

        it('Should throw an error if a parent account is deleted', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[4];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentNotFound);

        });

        it('Should throw an error if a parent account is disabled', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[5];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentNotFound);

        });

        it('Should throw an error if parent user id does not correspond to the parent role', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[6];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAParent);

        });

        it('Should throw an error if there is already a parent-student association', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[7];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentStudentAlreadyExists);

        });

        it('Should throw an error on save if document is invalid', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[8];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist correct parentStudentInvitation doc', async () => {

            const parentStudentInvitationDoc = unpersistedParentUserInvitations[9];
            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.eql(parentStudentInvitation);

        });

    });

    afterEach(db.teardown(baseParentStudentInvitationContext.persisted));

});
