const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassStudentNote } = require('../../../../src/db/models');

const { uniqueClassStudentNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

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
