const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Types } = require('mongoose');

const ParentStudentInvitation = require('../../../../src/db/models/parent-student-invitation');

const { baseParentStudentInvitationContext, uniqueParentStudentInvitationContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { user, parentStudentInvitation } = require('../../../../src/db/names');

const baseParentStudentInvitationContextModelNames = Object.keys(baseParentStudentInvitationContext.persisted);
const uniqueParentStudentInvitationContextModelNames = Object.keys(uniqueParentStudentInvitationContext.persisted);

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
    
    describe('[db/modsls/parent-student-invitation] - Unique parent-students', () => {

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
        
    afterEach(db.teardown(uniqueParentStudentInvitationContextModelNames));

});

describe('[db/models/parent-student-invitation] - baseParentStudentInvitation context', () => {

    beforeEach(db.init(baseParentStudentInvitationContext.persisted));

    const persistedUsers = baseParentStudentInvitationContext.persisted[user.modelName];
    const unpersistedParentUserInvitations = baseParentStudentInvitationContext.unpersisted[parentStudentInvitation.modelName];

    describe('[db/models/parent-student-invitation] - add', () => {

        it('Should throw an error if parent and student id match', async () => {

            const userId = persistedUsers[0]._id;

            const parentStudentInvitationDoc = {
                parent: userId,
                student: userId
            };

            await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if a student account is deleted', async () => {

            const parentId = persistedUsers[0]._id;

            const parentStudentInvitationDoc = {
                parent: parentId,
                student: new Types.ObjectId()
            };

            await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if a student account is disabled', async () => {

            const parentId = persistedUsers[0]._id;
            const disabledStudentId = persistedUsers[1]._id;

            const parentStudentInvitationDoc = {
                parent: parentId,
                student: disabledStudentId
            };

            await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if student account, for any reason, does not own the student role', async () => {

            const parentId = persistedUsers[0]._id;
            const notAStudentId = persistedUsers[3]._id;

            const parentStudentInvitationDoc = {
                parent: parentId,
                student: notAStudentId
            };

            await expect(ParentStudentInvitation.add(parentStudentInvitationDoc)).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error on save if document is invalid', async () => {
            const nonUniqueParentStudentInvitation = unpersistedParentUserInvitations[0];
            await expect(ParentStudentInvitation.add(nonUniqueParentStudentInvitation)).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist correct parentStudentInvitation doc', async () => {

            const uniqueParentStudentInvitationDoc = unpersistedParentUserInvitations[1];
            const parentStudentInvitation = await ParentStudentInvitation.add(uniqueParentStudentInvitationDoc);

            expect(parentStudentInvitation.parent).to.eql(uniqueParentStudentInvitationDoc.parent);
            expect(parentStudentInvitation.student).to.eql(uniqueParentStudentInvitationDoc.student);

        });

    });

    afterEach(db.teardown(baseParentStudentInvitationContextModelNames));

});
