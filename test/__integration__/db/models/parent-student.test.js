const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Types } = require('mongoose');

const ParentStudent = require('../../../../src/db/models/parent-student');

const { baseParentStudentContext, uniqueParentStudentContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { user, parentStudent } = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-student] - uniqueParentStudent context', () => {

    beforeEach(db.init(uniqueParentStudentContext.persisted));

    const unpersistedParentStudents = uniqueParentStudentContext.unpersisted[parentStudent.modelName];

    describe('[db/models/parent-student] - Non-unique parent-students', async () => {

        const nonUniqueParentStudentDoc = unpersistedParentStudents[3];

        it('Should not persist a parent-student that has the same user/role composite _id', async () => {
            const duplicateParentStudent = new ParentStudent(nonUniqueParentStudentDoc);
            await expect(duplicateParentStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });
    
    });
    
    describe('[db/models/parent-student] - Unique parent-students', () => {

        it('Should persist a parent-student with same parent _id and different student _id', async () => {
            
            const uniqueParentStudentDoc = unpersistedParentStudents[0];
            const parentStudent = new ParentStudent(uniqueParentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });
    
        it('Should persist a parent-student with same student _id and different parent _id', async () => {
            
            const uniqueParentStudentDoc = unpersistedParentStudents[1];
            const parentStudent = new ParentStudent(uniqueParentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });
    
        it('Should persist a parent-student with different parent and student _id', async () => {

            const uniqueParentStudentDoc = unpersistedParentStudents[2];
            const parentStudent = new ParentStudent(uniqueParentStudentDoc);

            await expect(parentStudent.save()).to.eventually.be.eql(parentStudent);

        });

    });
        
    afterEach(db.teardown(uniqueParentStudentContext.persisted));

});

describe('[db/models/parent-student] - baseParentStudent context', () => {

    beforeEach(db.init(baseParentStudentContext.persisted));

    const persistedUsers = baseParentStudentContext.persisted[user.modelName];
    const unpersistedParentStudents = baseParentStudentContext.unpersisted[parentStudent.modelName];

    describe('[db/models/parent-student] - methods.checkAndSave', () => {

        it('Should throw an error if parent and student id match', async () => {

            const userId = persistedUsers[0]._id;

            const parentStudentDoc = {
                parent: userId,
                student: userId
            };

            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if a parent account is deleted', async () => {

            const studentId = persistedUsers[0]._id;

            const parentStudentDoc = {
                parent: new Types.ObjectId(),
                student: studentId
            };

            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if a parent account is disabled', async () => {

            const studentId = persistedUsers[0]._id;
            const disabledParentId = persistedUsers[1]._id;

            const parentStudentDoc = {
                parent: disabledParentId,
                student: studentId
            };

            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error if parent account, for any reason, does not own the parent role', async () => {

            const studentId = persistedUsers[0]._id;
            const notAParentUserId = persistedUsers[3]._id;

            const parentStudentDoc = {
                parent: notAParentUserId,
                student: studentId
            };

            const parentStudent = new ParentStudent(parentStudentDoc);

            await expect(parentStudent.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw an error on save if document is invalid', async () => {

            const nonUniqueParentStudentDoc = unpersistedParentStudents[0];
            const nonUniqueParentStudent = new ParentStudent(nonUniqueParentStudentDoc);

            await expect(nonUniqueParentStudent.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist correct parentStudent doc', async () => {

            const uniqueParentStudentDoc = unpersistedParentStudents[1];
            const uniqueParentStudent = new ParentStudent(uniqueParentStudentDoc);

            const parentStudent = await uniqueParentStudent.checkAndSave();

            expect(parentStudent.parent).to.eql(uniqueParentStudentDoc.parent);
            expect(parentStudent.student).to.eql(uniqueParentStudentDoc.student);

        });

    });

    afterEach(db.teardown(baseParentStudentContext.persisted));

});
