const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ParentNote } = require('../../../../src/db/models');

const { uniqueParentNoteContext, baseParentNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');
const { modelErrorMessages } = require('../../../../src/util/errors');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-note] - uniqueParentNote context', () => {

    beforeEach(db.init(uniqueParentNoteContext.persisted));

    describe('[db/models/parent-note] - user/note.title index', () => {

        const unpersistedParentNotes = uniqueParentNoteContext.unpersisted[names.parentNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const parentNote = new ParentNote(unpersistedParentNotes[0]);
            await expect(parentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const parentNote = new ParentNote(unpersistedParentNotes[1]);
            await expect(parentNote.save()).to.eventually.be.eql(parentNote);
        });

    });

    afterEach(db.teardown(uniqueParentNoteContext.persisted));

});

describe('[db/models/parent-note] - baseParentNote context', () => {

    beforeEach(db.init(baseParentNoteContext.persisted));

    const unpersistedParentNotes = baseParentNoteContext.unpersisted[names.parentNote.modelName];

    describe('[db/models/parent-note] - methods.checkAndSave', () => {

        it('Should not persist if parent does not exist', async () => {

            const parentNoteDoc = unpersistedParentNotes[0];
            const parentNote = new ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if parent is disabled', async () => {

            const parentNoteDoc = unpersistedParentNotes[1];
            const parentNote = new ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if parent does not own the parent role', async () => {

            const parentNoteDoc = unpersistedParentNotes[2];
            const parentNote = new ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.fileStorePermissionDenied);

        });

        it('Should not persist if parent note fails on save (non-unique)', async () => {

            const parentNoteDoc = unpersistedParentNotes[3];
            const parentNote = new ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist proper parent note', async () => {

            const parentNoteDoc = unpersistedParentNotes[4];
            const parentNote = new ParentNote(parentNoteDoc);

            await expect(parentNote.checkAndSave()).to.eventually.eql(parentNote);

        });

    });

    afterEach(db.teardown(baseParentNoteContext.persisted));

});
