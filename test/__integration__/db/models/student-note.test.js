const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { StudentNote } = require('../../../../src/db/models');

const { uniqueStudentNoteContext, baseStudentNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');
const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/student-note] - uniqueStudentNote context', () => {

    beforeEach(db.init(uniqueStudentNoteContext.persisted));

    describe('[db/models/student-note] - user/note.title index', () => {

        const unpersistedStudentNotes = uniqueStudentNoteContext.unpersisted[names.studentNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const studentNote = new StudentNote(unpersistedStudentNotes[0]);
            await expect(studentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const studentNote = new StudentNote(unpersistedStudentNotes[1]);
            await expect(studentNote.save()).to.eventually.be.eql(studentNote);
        });

    });

    afterEach(db.teardown(uniqueStudentNoteContext.persisted));

});

describe('[db/models/student-note] - baseStudentNote context', () => {

    beforeEach(db.init(baseStudentNoteContext.persisted));

    const unpersistedStudentNotes = baseStudentNoteContext.unpersisted[names.studentNote.modelName];

    describe('[db/models/student-note] - methods.checkAndSave', () => {

        it('Should not persist if student does not exist', async () => {

            const studentNoteDoc = unpersistedStudentNotes[0];
            const studentNote = new StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if student is disabled', async () => {

            const studentNoteDoc = unpersistedStudentNotes[1];
            const studentNote = new StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if student does not own the student role', async () => {

            const studentNoteDoc = unpersistedStudentNotes[2];
            const studentNote = new StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should not persist if student note fails on save (non-unique)', async () => {

            const studentNoteDoc = unpersistedStudentNotes[3];
            const studentNote = new StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper student note', async () => {

            const studentNoteDoc = unpersistedStudentNotes[4];
            const studentNote = new StudentNote(studentNoteDoc);

            await expect(studentNote.checkAndSave()).to.eventually.eql(studentNote);

        });

    });

    afterEach(db.teardown(baseStudentNoteContext.persisted));

});
