const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session-student-note] - uniqueSessionStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionStudentNoteContext.persisted));

    describe('[db/models/session-student-note] - sessionStudent/note.title index', () => {

        const unpersistedSessionStudentNotes = fixtures.models.uniqueSessionStudentNoteContext.unpersisted[shared.db.names.sessionStudentNote.modelName];

        it('Should fail on duplicate sessionStudent/note.title index', async () => {
            const sessionStudentNote = new db.models.SessionStudentNote(unpersistedSessionStudentNotes[0]);
            await expect(sessionStudentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique sessionStudent/note.title index', async () => {
            const sessionStudentNote = new db.models.SessionStudentNote(unpersistedSessionStudentNotes[1]);
            await expect(sessionStudentNote.save()).to.eventually.be.eql(sessionStudentNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionStudentNoteContext.persisted));

});

describe('[db/models/session-student-note] - baseSessionStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionStudentNoteContext.persisted));

    const unpersistedSessionStudentNotes = fixtures.models.baseSessionStudentNoteContext.unpersisted[shared.db.names.sessionStudentNote.modelName];

    describe('[db/models/session-student-note] - methods.checkAndSave', () => {

        it('Should not persist if associated session-student does not exist', async () => {

            const sessionStudentNoteDoc = unpersistedSessionStudentNotes[0];
            const sessionStudentNote = new db.models.SessionStudentNote(sessionStudentNoteDoc);

            await expect(sessionStudentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.sessionStudentNotFound);

        });

        it('Should not persist if session-student note fails on save (non-unique)', async () => {

            const sessionStudentNoteDoc = unpersistedSessionStudentNotes[1];
            const sessionStudentNote = new db.models.SessionStudentNote(sessionStudentNoteDoc);

            await expect(sessionStudentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist on proper session-student note', async () => {

            const sessionStudentNoteDoc = unpersistedSessionStudentNotes[2];
            const sessionStudentNote = new db.models.SessionStudentNote(sessionStudentNoteDoc);

            await expect(sessionStudentNote.checkAndSave()).to.eventually.eql(sessionStudentNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionStudentNoteContext.persisted));

});
