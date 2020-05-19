const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student] - fixtures.models.uniqueClassStudentContext', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassStudentContext.persisted));

    const unpersistedClassStudents = fixtures.models.uniqueClassStudentContext.unpersisted[shared.db.names.classStudent.modelName];

    describe('[db/models/class-student] - class/user index', () => {

        it('Should fail on same class/user _id combo', async () => {

            const classStudentDoc = unpersistedClassStudents[0];
            const classStudent = new db.models.ClassStudent(classStudentDoc);
            
            await expect(classStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same class but different user', async () => {

            const classStudentDoc = unpersistedClassStudents[1];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

        it('Should persist on same user but different class', async () => {

            const classStudentDoc = unpersistedClassStudents[2];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

        it('Should persist on different class/user ids', async () => {

            const classStudentDoc = unpersistedClassStudents[3];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.save()).to.eventually.eql(classStudent);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassStudentContext.persisted));

});

describe('[db/models/class-student] - baseClassStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassStudentContext.persisted));

    const unpersistedClassStudents = fixtures.models.baseClassStudentContext.unpersisted[shared.db.names.classStudent.modelName];

    const persistedClassStudents = fixtures.models.baseClassStudentContext.persisted[shared.db.names.classStudent.modelName];
    const persistedUsers = fixtures.models.baseClassStudentContext.persisted[shared.db.names.user.modelName];

    describe('[db/models/class-student] - methods.checkKnownInvitationAndSave', () => {

        it('Should not persist if student does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[0];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student is disabled', async () => {

            const classStudentDoc = unpersistedClassStudents[1];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student does not have the student role', async () => {

            const classStudentDoc = unpersistedClassStudents[2];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.notAStudent);

        });

        it('Should not persist if class does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[3];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not persist if class teacher matchs the student id', async () => {

            const classStudentDoc = unpersistedClassStudents[4];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfTeaching);

        });

        it('Should not persist if there is not a proper class-student invitation in the database', async () => {

            const classStudentDoc = unpersistedClassStudents[5];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentInvitationRequired);

        });

        it('Should not persist if class-student is not unique (there is already an association). Invitation should be deleted', async () => {

            const classStudentDoc = unpersistedClassStudents[6];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

            const invitationExists = await db.models.ClassStudentInvitation.exists({
                class: classStudent.class,
                user: classStudent.user
            });

            expect(invitationExists).to.equal(false);

        });

        it('Should persist on correct class-student doc, removing invitation', async () => {

            const classStudentDoc = unpersistedClassStudents[7];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkKnownInvitationAndSave()).to.eventually.eql(classStudent);

            const invitationExists = await db.models.ClassStudentInvitation.exists({
                class: classStudent.class,
                user: classStudent.user
            });

            expect(invitationExists).to.equal(false);

        });

    });

    describe('[db/models/class-student] - methods.checkUnknownInvitationAndSave', () => {

        it('Should not persist if student does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[8];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student is disabled', async () => {

            const classStudentDoc = unpersistedClassStudents[9];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.studentNotFound);

        });

        it('Should not persist if student does not have the student role', async () => {

            const classStudentDoc = unpersistedClassStudents[10];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.notAStudent);

        });

        it('Should not persist if class does not exist', async () => {

            const classStudentDoc = unpersistedClassStudents[11];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not persist if class teacher matchs the student id', async () => {

            const classStudentDoc = unpersistedClassStudents[12];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.selfTeaching);

        });

        it('Should not persist there is not a proper class-unknown-student invitation in the database', async () => {

            const classStudentDoc = unpersistedClassStudents[13];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classUnknownStudentInvitationRequired);

        });

        it('Should not persist if class-student is not unique (there is already an association). Invitation should be deleted', async () => {

            const classStudentDoc = unpersistedClassStudents[14];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

            const invitationExists = await db.models.ClassUnknownStudentInvitation.exists({
                class: classStudent.class,
                email: persistedUsers[8].email
            });

            expect(invitationExists).to.equal(false);

        });

        it('Should persist on correct class-student doc, removing invitation', async () => {

            const classStudentDoc = unpersistedClassStudents[15];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.checkUnknownInvitationAndSave()).to.eventually.eql(classStudent);

            const invitationExists = await db.models.ClassUnknownStudentInvitation.exists({
                class: classStudent.class,
                email: persistedUsers[9].email
            });

            expect(invitationExists).to.equal(false);

        });

    });

    describe('[db/models/class-student] - methods.isStudentEnabled', async () => {

        it('Should throw error if class-student is not found', async () => {

            const classStudentDoc = unpersistedClassStudents[0];
            const classStudent = new db.models.ClassStudent(classStudentDoc);

            await expect(classStudent.isStudentEnabled()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentNotFound);

        });

        it('Should provide with user enabled flag', async () => {

            const classStudentOneId = persistedClassStudents[0]._id;
            const classStudent = await db.models.ClassStudent.findOne({ _id: classStudentOneId });

            const userFourEnabled = persistedUsers[3].enabled;

            await expect(classStudent.isStudentEnabled()).to.eventually.equal(userFourEnabled);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassStudentContext.persisted));

});

describe('[db/models/class-student] - baseClassStudentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassStudentFileContext.persisted));
    
    const persistedClassStudents = fixtures.models.baseClassStudentFileContext.persisted[shared.db.names.classStudent.modelName];

    describe('[db/models/class-student] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated class-student files upon class-student deletion', async () => {

            const classStudentOne = persistedClassStudents[0]._id;
            const classStudent = await db.models.ClassStudent.findOne({ _id: classStudentOne });

            await classStudent.remove();

            const docCount = await db.models.ClassStudentFile.countDocuments({
                classStudent: classStudentOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassStudentFileContext.persisted));

});

describe('[db/models/class-student] - baseClassStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassStudentNoteContext.persisted));
    
    const persistedClassStudents = fixtures.models.baseClassStudentNoteContext.persisted[shared.db.names.classStudent.modelName];

    describe('[db/models/class-student] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated class-student notes upon class-student deletion', async () => {

            const classStudentOne = persistedClassStudents[0]._id;
            const classStudent = await db.models.ClassStudent.findOne({ _id: classStudentOne });

            await classStudent.remove();

            const docCount = await db.models.ClassStudentNote.countDocuments({
                classStudent: classStudentOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassStudentNoteContext.persisted));

});

describe('[db/models/class-student] - removeClassStudentFiles context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeClassStudentFilesContext.persisted));

    const persistedClassStudents = fixtures.modelsStorage.removeClassStudentFilesContext.persisted.db[shared.db.names.classStudent.modelName];
    const persistedStorageClassStudentFiles = fixtures.modelsStorage.removeClassStudentFilesContext.persisted.storage[shared.db.names.classStudentFile.modelName];

    describe('[db/models/class-student] - pre remove hook', () => {

        it('Should delete actual class-student files from storage upon class-student deletion', async () => {

            const classStudentFileOneKeyname = persistedStorageClassStudentFiles[0].keyname;

            const classStudentOneId = persistedClassStudents[0]._id;
            const classStudentOne = await db.models.ClassStudent.findOne({ _id: classStudentOneId });

            await classStudentOne.remove();

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.classStudentFile.modelName]);
            expect(bucketKeys).to.not.include(classStudentFileOneKeyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeClassStudentFilesContext.persisted));

});
