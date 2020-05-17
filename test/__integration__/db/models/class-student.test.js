const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudent, ClassStudentInvitation, ClassUnknownStudentInvitation, ClassStudentFile } = require('../../../../src/db/models');

const { uniqueClassStudentContext, baseClassStudentContext, baseClassStudentFileContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const storageApi = require('../../../../src/api/storage');

const names = require('../../../../src/db/names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student] - uniqueClassStudentContext', () => {

    beforeEach(db.init(uniqueClassStudentContext.persisted));

    const unpersistedClassStudents = uniqueClassStudentContext.unpersisted[names.classStudent.modelName];

    describe('[db/models/class-student] - class/user index', () => {

        it('Should fail on same class/user _id combo', async () => {

            const classStudentDoc = unpersistedClassStudents[0];
            const classStudent = new ClassStudent(classStudentDoc);
            
            await expect(classStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different user', async () => {

            const classStudentDoc = unpersistedClassStudents[1];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

        it('Should persist on same user but different class', async () => {

            const classStudentDoc = unpersistedClassStudents[2];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

        it('Should persist on different class/user ids', async () => {

            const classStudentDoc = unpersistedClassStudents[3];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

    });

    afterEach(db.teardown(uniqueClassStudentContext.persisted));

});

describe('[db/models/class-student] - baseClassStudent context', () => {

    beforeEach(db.init(baseClassStudentContext.persisted));

    const unpersistedClassStudents = baseClassStudentContext.unpersisted[names.classStudent.modelName];

    describe('[db/models/class-student] - methods.checkKnownInvitationAndSave', () => {

        it('Should not persist if student does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[0];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student is disabled', async () => {

            const classStudentDoc = unpersistedClassStudents[1];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student does not have the student role', async () => {

            const classStudentDoc = unpersistedClassStudents[2];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAStudent);

        });

        it('Should not persist if class does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[3];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classNotFound);

        });

        it('Should not persist if class teacher matchs the student id', async () => {

            const classStudentDoc = unpersistedClassStudents[4];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfTeaching);

        });

        it('Should not persist if there is not a proper class-student invitation in the database', async () => {

            const classStudentDoc = unpersistedClassStudents[5];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classStudentInvitationRequired);

        });

        it('Should not persist if class-student is not unique (there is already an association). Invitation should be deleted', async () => {

            const classStudentDoc = unpersistedClassStudents[6];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

            const invitationExists = await ClassStudentInvitation.exists({
                class: classStudent.class,
                user: classStudent.user
            });

            expect(invitationExists).to.equal(false);

        });

        it('Should persist on correct class-student doc, removing invitation', async () => {

            const classStudentDoc = unpersistedClassStudents[7];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.eql(classStudent);

            const invitationExists = await ClassStudentInvitation.exists({
                class: classStudent.class,
                user: classStudent.user
            });

            expect(invitationExists).to.equal(false);

        });

    });

    describe('[db/models/class-student] - methods.checkUnknownInvitationAndSave', () => {

        const persistedUsers = baseClassStudentContext.persisted[names.user.modelName];

        it('Should not persist if student does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[8];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student is disabled', async () => {

            const classStudentDoc = unpersistedClassStudents[9];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student does not have the student role', async () => {

            const classStudentDoc = unpersistedClassStudents[10];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notAStudent);

        });

        it('Should not persist if class does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[11];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classNotFound);

        });

        it('Should not persist if class teacher matchs the student id', async () => {

            const classStudentDoc = unpersistedClassStudents[12];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfTeaching);

        });

        it('Should not persist there is not a proper class-unknown-student invitation in the database', async () => {

            const classStudentDoc = unpersistedClassStudents[13];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classUnknownStudentInvitationRequired);

        });

        it('Should not persist if class-student is not unique (there is already an association). Invitation should be deleted', async () => {

            const classStudentDoc = unpersistedClassStudents[14];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

            const invitationExists = await ClassUnknownStudentInvitation.exists({
                class: classStudent.class,
                email: persistedUsers[8].email
            });

            expect(invitationExists).to.equal(false);

        });

        it('Should persist on correct class-student doc, removing invitation', async () => {

            const classStudentDoc = unpersistedClassStudents[15];
            const classStudent = new ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.eql(classStudent);

            const invitationExists = await ClassUnknownStudentInvitation.exists({
                class: classStudent.class,
                email: persistedUsers[9].email
            });

            expect(invitationExists).to.equal(false);

        });

    });

    afterEach(db.teardown(baseClassStudentContext.persisted));

});

describe('[db/models/class-student] - baseClassStudentFile context', () => {

    beforeEach(db.init(baseClassStudentFileContext.persisted));
    
    const persistedClassStudents = baseClassStudentFileContext.persisted[names.classStudent.modelName];

    describe('[db/models/class-student] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').resolves());

        it('Should delete all associated class-student files upon class-student deletion', async () => {

            const classStudentOne = persistedClassStudents[0]._id;
            const classStudent = await ClassStudent.findOne({ _id: classStudentOne });

            await classStudent.remove();

            const docCount = await ClassStudentFile.countDocuments({
                classStudent: classStudentOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(db.teardown(baseClassStudentFileContext.persisted));

});
