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

describe('[db/models/session-student] - uniqueSessionStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionStudentContext.persisted));

    const unpersistedSessionStudents = fixtures.models.uniqueSessionStudentContext.unpersisted[shared.db.names.sessionStudent.modelName];

    describe('[db/models/session-student] - classStudent/session index', () => {

        it('Should fail on same classStudent/session _id combo', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[0];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);
            
            await expect(sessionStudent.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        
        });

        it('Should persist on same classStudent but different session', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[1];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.save()).to.eventually.eql(sessionStudent);

        });

        it('Should persist on same session but different classStudent', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[2];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.save()).to.eventually.eql(sessionStudent);

        });

        it('Should persist on different classStudent/session ids', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[3];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.save()).to.eventually.eql(sessionStudent);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionStudentContext.persisted));

});

describe('[db/models/session-student] - baseSessionStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionStudentContext.persisted));

    const unpersistedSessionStudents = fixtures.models.baseSessionStudentContext.unpersisted[shared.db.names.sessionStudent.modelName];

    describe('[db/models/session-student] - methods.checkAndSave', () => {

        it('Should throw error if associated session does not exist', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[0];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.sessionNotFound);

        });

        it('Should throw error if class-student to associate has its account disabled', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[1];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userDisabled);

        });

        it('Should throw error if sessionStudent.save fails', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[2];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist sessionStudent if all conditions are met', async () => {

            const sessionStudentDoc = unpersistedSessionStudents[3];
            const sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

            await expect(sessionStudent.checkAndSave()).to.eventually.eql(sessionStudent);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionStudentContext.persisted));

});

describe('[db/models/session-student] - baseSessionStudentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionStudentFileContext.persisted));

    const persistedSessionStudents = fixtures.models.baseSessionStudentFileContext.persisted[shared.db.names.sessionStudent.modelName];

    describe('[db/models/session-student] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated session student files upon session student removal', async () => {

            const sessionStudentOneId = persistedSessionStudents[0]._id;
            const sessionStudentOne = await db.models.SessionStudent.findOne({ _id: sessionStudentOneId });

            await sessionStudentOne.remove();

            const docCount = await db.models.SessionStudentFile.countDocuments({
                sessionStudent: sessionStudentOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionStudentFileContext.persisted));

});

describe('[db/models/session-student] - baseSessionStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionStudentNoteContext.persisted));

    const persistedSessionStudents = fixtures.models.baseSessionStudentNoteContext.persisted[shared.db.names.sessionStudent.modelName];

    describe('[db/models/session-student] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated session student notes upon session student removal', async () => {

            const sessionStudentOneId = persistedSessionStudents[0]._id;
            const sessionStudentOne = await db.models.SessionStudent.findOne({ _id: sessionStudentOneId });

            await sessionStudentOne.remove();

            const docCount = await db.models.SessionStudentNote.countDocuments({
                sessionStudent: sessionStudentOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionStudentNoteContext.persisted));

});

describe('[db/models/session-student] - removeClassStudentFiles context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.removeSessionStudentFilesContext.persisted));

    const persistedSessionStudents = fixtures.modelsStorage.removeSessionStudentFilesContext.persisted.db[shared.db.names.sessionStudent.modelName];
    const persistedStorageSessionStudentFiles = fixtures.modelsStorage.removeSessionStudentFilesContext.persisted.storage[shared.db.names.sessionStudentFile.modelName];

    describe('[db/models/session-student] - pre remove hook', () => {

        it('Should delete actual session-student files from storage upon session-student deletion', async () => {

            const sessionStudentFileOneKeyname = persistedStorageSessionStudentFiles[0].keyname;

            const sessionStudentOneId = persistedSessionStudents[0]._id;
            const sessionStudentOne = await db.models.SessionStudent.findOne({ _id: sessionStudentOneId });

            await sessionStudentOne.remove();

            const bucketKeys = await api.storage.listBucketKeys(api.storage.config.bucketNames[shared.db.names.sessionStudentFile.modelName]);
            expect(bucketKeys).to.not.include(sessionStudentFileOneKeyname);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.removeSessionStudentFilesContext.persisted));

});
