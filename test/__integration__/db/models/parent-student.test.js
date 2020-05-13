const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ParentStudent, ParentStudentInvitation } = require('../../../../src/db/models');

const { baseParentStudentContext, uniqueParentStudentContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-student] - uniqueParentStudent context', () => {

    beforeEach(db.init(uniqueParentStudentContext.persisted));

    const unpersistedParentStudents = uniqueParentStudentContext.unpersisted[names.parentStudent.modelName];

    describe('[db/models/parent-student] - Non-unique parent-students', async () => {

        const parentStudentDoc = unpersistedParentStudents[3];

        it('Should not persist a parent-student that has the same user/role composite _id', async () => {
            const parentStudent = new ParentStudent(parentStudentDoc);
            await expect(parentStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/parent-student] - Unique parent-students', () => {

        it('Should persist a parent-student with same parent _id and different student _id', async () => {
            
            const parentStudentDoc = unpersistedParentStudents[0];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });
    
        it('Should persist a parent-student with same student _id and different parent _id', async () => {
            
            const parentStudentDoc = unpersistedParentStudents[1];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });
    
        it('Should persist a parent-student with different parent and student _id', async () => {

            const parentStudentDoc = unpersistedParentStudents[2];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });

    });
        
    afterEach(db.teardown(uniqueParentStudentContext.persisted));

});

describe('[db/models/parent-student] - baseParentStudent context', () => {

    beforeEach(db.init(baseParentStudentContext.persisted));

    const unpersistedParentStudents = baseParentStudentContext.unpersisted[names.parentStudent.modelName];

    describe('[db/models/parent-student] - methods.checkAndSave', () => {

        it('Should throw an error if parent and student id match', async () => {

            const parentStudentDoc = unpersistedParentStudents[0];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfAssociation);

        });

        it('Should throw an error if a parent account is deleted', async () => {

            const parentStudentDoc = unpersistedParentStudents[1];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentNotFound);

        });

        it('Should throw an error if a parent account is disabled', async () => {

            const parentStudentDoc = unpersistedParentStudents[2];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentNotFound);

        });

        it('Should throw an error if parent user id is does not correspond to a parent role', async () => {

            const parentStudentDoc = unpersistedParentStudents[3];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAParent);

        });

        it('Should throw error if a student account is deleted', async () => {

            const parentStudentDoc = unpersistedParentStudents[4];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should throw error if a student account is disabled', async () => {

            const parentStudentDoc = unpersistedParentStudents[5];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should throw error if student user id does not correspond to the user role', async () => {

            const parentStudentDoc = unpersistedParentStudents[6];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAStudent);

        });

        it('Should throw an error if there is no associated parent-student-invitation', async () => {

            const parentStudentDoc = unpersistedParentStudents[7];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.parentStudentInvitationRequired);

        });

        it('Should persist correct parentStudent doc and delete associated invitation', async () => {

            const parentStudentDoc = unpersistedParentStudents[8];
            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.eql(parentStudent);

            const invitationExists = await ParentStudentInvitation.exists({
                parent: parentStudent.parent,
                student: parentStudent.student
            });

            expect(invitationExists).to.equal(false);

        });

    });

    afterEach(db.teardown(baseParentStudentContext.persisted));

});
