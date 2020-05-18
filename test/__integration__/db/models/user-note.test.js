const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-note] - uniqueUserNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueUserNoteContext.persisted));

    describe('[db/models/user-note] - user/note.title index', () => {

        const unpersistedUserNotes = fixtures.models.uniqueUserNoteContext.unpersisted[shared.db.names.userNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const userNote = new db.models.UserNote(unpersistedUserNotes[0]);
            await expect(userNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const userNote = new db.models.UserNote(unpersistedUserNotes[1]);
            await expect(userNote.save()).to.eventually.be.eql(userNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueUserNoteContext.persisted));

});

describe('[db/models/user-note] - baseUserNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseUserNoteContext.persisted));

    const unpersistedUserNotes = fixtures.models.baseUserNoteContext.unpersisted[shared.db.names.userNote.modelName];

    describe('[db/models/user-note] - methods.checkAndSave', () => {

        it('Should not persist if user does not exist', async () => {

            const userNoteDoc = unpersistedUserNotes[0];
            const userNote = new db.models.UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if user is disabled', async () => {

            const userNoteDoc = unpersistedUserNotes[1];
            const userNote = new db.models.UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if user-note fails on save (non-unique)', async () => {

            const userNoteDoc = unpersistedUserNotes[2];
            const userNote = new db.models.UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist correct, unique user note', async () => {

            const userNoteDoc = unpersistedUserNotes[3];
            const userNote = new db.models.UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.eql(userNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseUserNoteContext.persisted));

});
