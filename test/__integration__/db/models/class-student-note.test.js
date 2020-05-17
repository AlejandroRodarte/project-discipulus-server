const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudentNote } = require('../../../../src/db/models');

const { uniqueClassStudentNoteContext, baseClassStudentNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');
const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-note] - uniqueClassStudentNote context', () => {

    beforeEach(db.init(uniqueClassStudentNoteContext.persisted));

    describe('[db/models/class-student-note] - user/file.originalname index', () => {

        const unpersistedClassStudentNotes = uniqueClassStudentNoteContext.unpersisted[names.classStudentNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const classStudentNote = new ClassStudentNote(unpersistedClassStudentNotes[0]);
            await expect(classStudentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const classStudentNote = new ClassStudentNote(unpersistedClassStudentNotes[1]);
            await expect(classStudentNote.save()).to.eventually.be.eql(classStudentNote);
        });

    });

    afterEach(db.teardown(uniqueClassStudentNoteContext.persisted));

});

describe('[db/models/class-student-note] - baseClassStudentNote context', () => {

    beforeEach(db.init(baseClassStudentNoteContext.persisted));

    const unpersistedClassStudentNotes = baseClassStudentNoteContext.unpersisted[names.classStudentNote.modelName];

    describe('[db/models/class-student-note] - methods.checkAndSave', () => {

        it('Should not persist if associated class-student does not exist', async () => {

            const classStudentNoteDoc = unpersistedClassStudentNotes[0];
            const classStudentNote = new ClassStudentNote(classStudentNoteDoc);

            await expect(classStudentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.classStudentNotFound);

        });

        it('Should not persist if class-student note fails on save (non-unique)', async () => {

            const classStudentNoteDoc = unpersistedClassStudentNotes[1];
            const classStudentNote = new ClassStudentNote(classStudentNoteDoc);

            await expect(classStudentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist on proper class-student note', async () => {

            const classStudentNoteDoc = unpersistedClassStudentNotes[2];
            const classStudentNote = new ClassStudentNote(classStudentNoteDoc);

            await expect(classStudentNote.checkAndSave()).to.eventually.eql(classStudentNote);

        });

    });

    afterEach(db.teardown(baseClassStudentNoteContext.persisted));

});
