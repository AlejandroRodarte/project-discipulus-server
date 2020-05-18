const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/student-note] - uniqueStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueStudentNoteContext.persisted));

    describe('[db/models/student-note] - user/note.title index', () => {

        const unpersistedStudentNotes = fixtures.models.uniqueStudentNoteContext.unpersisted[shared.db.names.studentNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const studentNote = new db.models.StudentNote(unpersistedStudentNotes[0]);
            await expect(studentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const studentNote = new db.models.StudentNote(unpersistedStudentNotes[1]);
            await expect(studentNote.save()).to.eventually.be.eql(studentNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueStudentNoteContext.persisted));

});

describe('[db/models/student-note] - baseStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseStudentNoteContext.persisted));

    const unpersistedStudentNotes = fixtures.models.baseStudentNoteContext.unpersisted[shared.db.names.studentNote.modelName];

    describe('[db/models/student-note] - methods.checkAndSave', () => {

        it('Should not persist if student does not exist', async () => {

            const studentNoteDoc = unpersistedStudentNotes[0];
            const studentNote = new db.models.StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if student is disabled', async () => {

            const studentNoteDoc = unpersistedStudentNotes[1];
            const studentNote = new db.models.StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if student does not own the student role', async () => {

            const studentNoteDoc = unpersistedStudentNotes[2];
            const studentNote = new db.models.StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should not persist if student note fails on save (non-unique)', async () => {

            const studentNoteDoc = unpersistedStudentNotes[3];
            const studentNote = new db.models.StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper student note', async () => {

            const studentNoteDoc = unpersistedStudentNotes[4];
            const studentNote = new db.models.StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.eql(studentNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseStudentNoteContext.persisted));

});
