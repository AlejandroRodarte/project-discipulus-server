const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassNote } = require('../../../../src/db/models');

const { uniqueClassNoteContext, baseClassNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');
const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-note] - uniqueClassNote context', () => {

    beforeEach(db.init(uniqueClassNoteContext.persisted));

    describe('[db/models/class-note] - user/file.originalname index', () => {

        const unpersistedClassNotes = uniqueClassNoteContext.unpersisted[names.classNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const classNote = new ClassNote(unpersistedClassNotes[0]);
            await expect(classNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const classNote = new ClassNote(unpersistedClassNotes[1]);
            await expect(classNote.save()).to.eventually.be.eql(classNote);
        });

    });

    afterEach(db.teardown(uniqueClassNoteContext.persisted));

});

describe('[db/models/class-note] - baseClassNote context', () => {

    beforeEach(db.init(baseClassNoteContext.persisted));

    const unpersistedClassNotes = baseClassNoteContext.unpersisted[names.classNote.modelName];

    describe('[db/models/class-note] - methods.checkAndSave', () => {

        it('Should not persist if associated class does not exist', async () => {

            const classNoteDoc = unpersistedClassNotes[0];
            const classNote = new ClassNote(classNoteDoc);

            await expect(classNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classNotFound);

        });

        it('Should not persist if class note fails on save (non-unique)', async () => {

            const classNoteDoc = unpersistedClassNotes[1];
            const classNote = new ClassNote(classNoteDoc);

            await expect(classNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist on proper class note', async () => {

            const classNoteDoc = unpersistedClassNotes[2];
            const classNote = new ClassNote(classNoteDoc);

            await expect(classNote.checkAndSave()).to.eventually.eql(classNote);

        });

    });

    afterEach(db.teardown(baseClassNoteContext.persisted));

});
