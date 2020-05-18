const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/teacher-note] - uniqueTeacherNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueTeacherNoteContext.persisted));

    describe('[db/models/teacher-note] - user/note.title index', () => {

        const unpersistedTeacherNotes = fixtures.models.uniqueTeacherNoteContext.unpersisted[shared.db.names.teacherNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const teacherNote = new db.models.TeacherNote(unpersistedTeacherNotes[0]);
            await expect(teacherNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const teacherNote = new db.models.TeacherNote(unpersistedTeacherNotes[1]);
            await expect(teacherNote.save()).to.eventually.be.eql(teacherNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueTeacherNoteContext.persisted));

});

describe('[db/models/teacher-note] - baseTeacherNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseTeacherNoteContext.persisted));

    const unpersistedTeacherNotes = fixtures.models.baseTeacherNoteContext.unpersisted[shared.db.names.teacherNote.modelName];

    describe('[db/models/teacher-note] - methods.checkAndSave', () => {

        it('Should not persist if teacher does not exist', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[0];
            const teacherNote = new db.models.TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if teacher is disabled', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[1];
            const teacherNote = new db.models.TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if teacher does not own the teacher role', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[2];
            const teacherNote = new db.models.TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should not persist if teacher note fails on save (non-unique)', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[3];
            const teacherNote = new db.models.TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper teacher note', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[4];
            const teacherNote = new db.models.TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.eql(teacherNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseTeacherNoteContext.persisted));

});
