const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-note] - uniqueParentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueParentNoteContext.persisted));

    describe('[db/models/parent-note] - user/note.title index', () => {

        const unpersistedParentNotes = fixtures.models.uniqueParentNoteContext.unpersisted[shared.db.names.parentNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const parentNote = new db.models.ParentNote(unpersistedParentNotes[0]);
            await expect(parentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const parentNote = new db.models.ParentNote(unpersistedParentNotes[1]);
            await expect(parentNote.save()).to.eventually.be.eql(parentNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueParentNoteContext.persisted));

});

describe('[db/models/parent-note] - baseParentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseParentNoteContext.persisted));

    const unpersistedParentNotes = fixtures.models.baseParentNoteContext.unpersisted[shared.db.names.parentNote.modelName];

    describe('[db/models/parent-note] - methods.checkAndSave', () => {

        it('Should not persist if parent does not exist', async () => {

            const parentNoteDoc = unpersistedParentNotes[0];
            const parentNote = new db.models.ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if parent is disabled', async () => {

            const parentNoteDoc = unpersistedParentNotes[1];
            const parentNote = new db.models.ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if parent does not own the parent role', async () => {

            const parentNoteDoc = unpersistedParentNotes[2];
            const parentNote = new db.models.ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should not persist if parent note fails on save (non-unique)', async () => {

            const parentNoteDoc = unpersistedParentNotes[3];
            const parentNote = new db.models.ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper parent note', async () => {

            const parentNoteDoc = unpersistedParentNotes[4];
            const parentNote = new db.models.ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.eql(parentNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseParentNoteContext.persisted));

});
