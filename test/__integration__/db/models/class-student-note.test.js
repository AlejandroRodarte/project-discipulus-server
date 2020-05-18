const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class-student-note] - uniqueClassStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueClassStudentNoteContext.persisted));

    describe('[db/models/class-student-note] - user/file.originalname index', () => {

        const unpersistedClassStudentNotes = fixtures.models.uniqueClassStudentNoteContext.unpersisted[shared.db.names.classStudentNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const classStudentNote = new db.models.ClassStudentNote(unpersistedClassStudentNotes[0]);
            await expect(classStudentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const classStudentNote = new db.models.ClassStudentNote(unpersistedClassStudentNotes[1]);
            await expect(classStudentNote.save()).to.eventually.be.eql(classStudentNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueClassStudentNoteContext.persisted));

});

describe('[db/models/class-student-note] - baseClassStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseClassStudentNoteContext.persisted));

    const unpersistedClassStudentNotes = fixtures.models.baseClassStudentNoteContext.unpersisted[shared.db.names.classStudentNote.modelName];

    describe('[db/models/class-student-note] - methods.checkAndSave', () => {

        it('Should not persist if associated class-student does not exist', async () => {

            const classStudentNoteDoc = unpersistedClassStudentNotes[0];
            const classStudentNote = new db.models.ClassStudentNote(classStudentNoteDoc);

            await expect(classStudentNote.checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentNotFound);

        });

        it('Should not persist if class-student note fails on save (non-unique)', async () => {

            const classStudentNoteDoc = unpersistedClassStudentNotes[1];
            const classStudentNote = new db.models.ClassStudentNote(classStudentNoteDoc);

            await expect(classStudentNote.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist on proper class-student note', async () => {

            const classStudentNoteDoc = unpersistedClassStudentNotes[2];
            const classStudentNote = new db.models.ClassStudentNote(classStudentNoteDoc);

            await expect(classStudentNote.checkAndSave()).to.eventually.eql(classStudentNote);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseClassStudentNoteContext.persisted));

});
