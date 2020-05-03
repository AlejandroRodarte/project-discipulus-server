const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Types } = require('mongoose');

const ParentStudentInvitation = require('../../../../src/db/models/parent-student-invitation');

const { baseParentStudentInvitationContext, uniqueParentStudentInvitationContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { user, parentStudentInvitation } = require('../../../../src/db/names');


const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-student-invitation] - uniqueParentStudentInvitation context', () => {

    beforeEach(db.init(uniqueParentStudentInvitationContext.persisted));

    const unpersistedParentUserInvitations = uniqueParentStudentInvitationContext.unpersisted[parentStudentInvitation.modelName];

    describe('[db/models/parent-student-invitation] - Non-unique parent-students', async () => {

        const nonUniqueParentStudentInvitation = unpersistedParentUserInvitations[3];

        it('Should not persist a parent-student-invitation that has the same user/role composite _id', async () => {
            const duplicateParentStudentInvitation = new ParentStudentInvitation(nonUniqueParentStudentInvitation);
            await expect(duplicateParentStudentInvitation.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/parent-student-invitation] - Unique parent-students', () => {

        it('Should persist a parent-student-invitation with same parent _id and different student _id', async () => {
            
            const uniqueParentStudentInvitationDoc = unpersistedParentUserInvitations[0];
            const parentStudentInvitation = new ParentStudentInvitation(uniqueParentStudentInvitationDoc);

            await expect(parentStudentInvitation.save()).to.eventually.be.eql(parentStudentInvitation);

        });
    
        it('Should persist a parent-student-invitation with same student _id and different parent _id', async () => {
            
            const uniqueParentStudentInvitationDoc = unpersistedParentUserInvitations[1];
            const parentStudentInvitation = new ParentStudentInvitation(uniqueParentStudentInvitationDoc);

            await expect(parentStudentInvitation.save()).to.eventually.be.eql(parentStudentInvitation);

        });
    
        it('Should persist a parent-student-invitation with different parent and student _id', async () => {

            const uniqueParentStudentInvitationDoc = unpersistedParentUserInvitations[2];
            const parentStudentInvitation = new ParentStudentInvitation(uniqueParentStudentInvitationDoc);

            await expect(parentStudentInvitation.save()).to.eventually.be.eql(parentStudentInvitation);

        });

    });
        
    afterEach(db.teardown(uniqueParentStudentInvitationContext.persisted));

});

describe('[db/models/parent-student-invitation] - baseParentStudentInvitation context', () => {

    beforeEach(db.init(baseParentStudentInvitationContext.persisted));

    const persistedUsers = baseParentStudentInvitationContext.persisted[user.modelName];
    const unpersistedParentUserInvitations = baseParentStudentInvitationContext.unpersisted[parentStudentInvitation.modelName];

    describe('[db/models/parent-student-invitation] - methods.checkAndSave', () => {

        it('Should throw an error if parent and student id match', async () => {

            const userId = persistedUsers[0]._id;

            const parentStudentInvitationDoc = {
                parent: userId,
                student: userId
            };

            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if a student account is deleted', async () => {

            const parentId = persistedUsers[0]._id;

            const parentStudentInvitationDoc = {
                parent: parentId,
                student: new Types.ObjectId()
            };

            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if a student account is disabled', async () => {

            const parentId = persistedUsers[0]._id;
            const disabledStudentId = persistedUsers[1]._id;

            const parentStudentInvitationDoc = {
                parent: parentId,
                student: disabledStudentId
            };

            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if student account, for any reason, does not own the student role', async () => {

            const parentId = persistedUsers[0]._id;
            const notAStudentId = persistedUsers[3]._id;

            const parentStudentInvitationDoc = {
                parent: parentId,
                student: notAStudentId
            };

            const parentStudentInvitation = new ParentStudentInvitation(parentStudentInvitationDoc);

            await expect(parentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error on save if document is invalid', async () => {

            const nonUniqueParentStudentInvitationDoc = unpersistedParentUserInvitations[0];
            const nonUniqueParentStudentInvitation = new ParentStudentInvitation(nonUniqueParentStudentInvitationDoc);

            await expect(nonUniqueParentStudentInvitation.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist correct parentStudentInvitation doc', async () => {

            const uniqueParentStudentInvitationDoc = unpersistedParentUserInvitations[1];
            const uniqueParentStudentInvitation = new ParentStudentInvitation(uniqueParentStudentInvitationDoc);

            const parentStudentInvitation = await uniqueParentStudentInvitation.checkAndSave();

            expect(parentStudentInvitation.parent).to.eql(uniqueParentStudentInvitationDoc.parent);
            expect(parentStudentInvitation.student).to.eql(uniqueParentStudentInvitationDoc.student);

        });

    });

    afterEach(db.teardown(baseParentStudentInvitationContext.persisted));

});
