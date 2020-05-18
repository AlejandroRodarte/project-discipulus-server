const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-note] - uniqueClassNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassNoteContext.persisted));

    describe('[db/models/class-note] - user/file.originalname index', () => {

        const unpersistedClassNotes = fixtures.models.uniqueClassNoteContext.unpersisted[shared.db.names.classNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const classNote = new db.models.ClassNote(unpersistedClassNotes[0]);
            await expect(classNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const classNote = new db.models.ClassNote(unpersistedClassNotes[1]);
            await expect(classNote.save()).to.eventually.be.eql(classNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassNoteContext.persisted));

});

describe('[db/models/class-note] - baseClassNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassNoteContext.persisted));

    const unpersistedClassNotes = fixtures.models.baseClassNoteContext.unpersisted[shared.db.names.classNote.modelName];

    describe('[db/models/class-note] - methods.checkAndSave', () => {

        it('Should not persist if associated class does not exist', async () => {

            const classNoteDoc = unpersistedClassNotes[0];
            const classNote = new db.models.ClassNote(classNoteDoc);

            await expect(classNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should not persist if class note fails on save (non-unique)', async () => {

            const classNoteDoc = unpersistedClassNotes[1];
            const classNote = new db.models.ClassNote(classNoteDoc);

            await expect(classNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist on proper class note', async () => {

            const classNoteDoc = unpersistedClassNotes[2];
            const classNote = new db.models.ClassNote(classNoteDoc);

            await expect(classNote.checkAndSave()).to.eventually.eql(classNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassNoteContext.persisted));

});
