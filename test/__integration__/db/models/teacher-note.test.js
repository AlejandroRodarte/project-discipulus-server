const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { TeacherNote } = require('../../../../src/db/models');

const { uniqueTeacherNoteContext, baseTeacherNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');
const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/teacher-note] - uniqueTeacherNote context', () => {

    beforeEach(db.init(uniqueTeacherNoteContext.persisted));

    describe('[db/models/teacher-note] - user/note.title index', () => {

        const unpersistedTeacherNotes = uniqueTeacherNoteContext.unpersisted[names.teacherNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const teacherNote = new TeacherNote(unpersistedTeacherNotes[0]);
            await expect(teacherNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const teacherNote = new TeacherNote(unpersistedTeacherNotes[1]);
            await expect(teacherNote.save()).to.eventually.be.eql(teacherNote);
        });

    });

    afterEach(db.teardown(uniqueTeacherNoteContext.persisted));

});

describe('[db/models/teacher-note] - baseTeacherNote context', () => {

    beforeEach(db.init(baseTeacherNoteContext.persisted));

    const unpersistedTeacherNotes = baseTeacherNoteContext.unpersisted[names.teacherNote.modelName];

    describe('[db/models/teacher-note] - methods.checkAndSave', () => {

        it('Should not persist if teacher does not exist', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[0];
            const teacherNote = new TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if teacher is disabled', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[1];
            const teacherNote = new TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if teacher does not own the teacher role', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[2];
            const teacherNote = new TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should not persist if teacher note fails on save (non-unique)', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[3];
            const teacherNote = new TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper teacher note', async () => {

            const teacherNoteDoc = unpersistedTeacherNotes[4];
            const teacherNote = new TeacherNote(teacherNoteDoc);

            await expect(teacherNote.checkAndSave()).to.eventually.eql(teacherNote);

        });

    });

    afterEach(db.teardown(baseTeacherNoteContext.persisted));

});
