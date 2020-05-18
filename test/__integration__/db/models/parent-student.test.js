const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-student] - uniqueParentStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueParentStudentContext.persisted));

    const unpersistedParentStudents = fixtures.models.uniqueParentStudentContext.unpersisted[shared.db.names.parentStudent.modelName];

    describe('[db/models/parent-student] - Non-unique parent-students', async () => {

        const parentStudentDoc = unpersistedParentStudents[3];

        it('Should not persist a parent-student that has the same user/role composite _id', async () => {
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);
            await expect(parentStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/parent-student] - Unique parent-students', () => {

        it('Should persist a parent-student with same parent _id and different student _id', async () => {
            
            const parentStudentDoc = unpersistedParentStudents[0];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });
    
        it('Should persist a parent-student with same student _id and different parent _id', async () => {
            
            const parentStudentDoc = unpersistedParentStudents[1];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });
    
        it('Should persist a parent-student with different parent and student _id', async () => {

            const parentStudentDoc = unpersistedParentStudents[2];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });

    });
        
    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueParentStudentContext.persisted));

});

describe('[db/models/parent-student] - baseParentStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseParentStudentContext.persisted));

    const unpersistedParentStudents = fixtures.models.baseParentStudentContext.unpersisted[shared.db.names.parentStudent.modelName];

    describe('[db/models/parent-student] - methods.checkAndSave', () => {

        it('Should throw an error if parent and student id match', async () => {

            const parentStudentDoc = unpersistedParentStudents[0];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfAssociation);

        });

        it('Should throw an error if a parent account is deleted', async () => {

            const parentStudentDoc = unpersistedParentStudents[1];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.parentNotFound);

        });

        it('Should throw an error if a parent account is disabled', async () => {

            const parentStudentDoc = unpersistedParentStudents[2];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.parentNotFound);

        });

        it('Should throw an error if parent user id is does not correspond to a parent role', async () => {

            const parentStudentDoc = unpersistedParentStudents[3];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.notAParent);

        });

        it('Should throw error if a student account is deleted', async () => {

            const parentStudentDoc = unpersistedParentStudents[4];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should throw error if a student account is disabled', async () => {

            const parentStudentDoc = unpersistedParentStudents[5];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should throw error if student user id does not correspond to the user role', async () => {

            const parentStudentDoc = unpersistedParentStudents[6];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.notAStudent);

        });

        it('Should throw an error if there is no associated parent-student-invitation', async () => {

            const parentStudentDoc = unpersistedParentStudents[7];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.parentStudentInvitationRequired);

        });

        it('Should throw an error if, for some reason, there is an invitation for an already associated user. Invitation should be deleted', async () => {

            const parentStudentDoc = unpersistedParentStudents[8];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

            const invitationExists = await db.models.ParentStudentInvitation.exists({
                parent: parentStudent.parent,
                student: parentStudent.student
            });

            expect(invitationExists).to.equal(false);

        });

        it('Should persist correct parentStudent doc and delete associated invitation', async () => {

            const parentStudentDoc = unpersistedParentStudents[9];
            const parentStudent = new db.models.ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.eql(parentStudent);

            const invitationExists = await db.models.ParentStudentInvitation.exists({
                parent: parentStudent.parent,
                student: parentStudent.student
            });

            expect(invitationExists).to.equal(false);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseParentStudentContext.persisted));

});
