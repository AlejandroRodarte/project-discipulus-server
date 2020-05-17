const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { UserNote } = require('../../../../src/db/models');

const { uniqueUserNoteContext, baseUserNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');
const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-note] - uniqueUserNote context', () => {

    beforeEach(db.init(uniqueUserNoteContext.persisted));

    describe('[db/models/user-note] - user/note.title index', () => {

        const unpersistedUserNotes = uniqueUserNoteContext.unpersisted[names.userNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const userNote = new UserNote(unpersistedUserNotes[0]);
            await expect(userNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const userNote = new UserNote(unpersistedUserNotes[1]);
            await expect(userNote.save()).to.eventually.be.eql(userNote);
        });

    });

    afterEach(db.teardown(uniqueUserNoteContext.persisted));

});

describe('[db/models/user-note] - baseUserNote context', () => {

    beforeEach(db.init(baseUserNoteContext.persisted));

    const unpersistedUserNotes = baseUserNoteContext.unpersisted[names.userNote.modelName];

    describe('[db/models/user-note] - methods.checkAndSave', () => {

        it('Should not persist if user does not exist', async () => {

            const userNoteDoc = unpersistedUserNotes[0];
            const userNote = new UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if user is disabled', async () => {

            const userNoteDoc = unpersistedUserNotes[1];
            const userNote = new UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        });

        it('Should not persist if user-note fails on save (non-unique)', async () => {

            const userNoteDoc = unpersistedUserNotes[2];
            const userNote = new UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist correct, unique user note', async () => {

            const userNoteDoc = unpersistedUserNotes[3];
            const userNote = new UserNote(userNoteDoc);

            await expect(userNote.checkAndSave()).to.eventually.eql(userNote);

        });

    });

    afterEach(db.teardown(baseUserNoteContext.persisted));

});
