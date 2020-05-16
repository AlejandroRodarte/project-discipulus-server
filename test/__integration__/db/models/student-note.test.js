const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { StudentNote } = require('../../../../src/db/models');

const { uniqueStudentNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/student-note] - uniqueStudentNote context', () => {

    beforeEach(db.init(uniqueStudentNoteContext.persisted));

    describe('[db/models/student-note] - user/note.title index', () => {

        const unpersistedStudentNotes = uniqueStudentNoteContext.unpersisted[names.studentNote.modelName];

        it('Should fail on duplicate user/note.title index', async () => {
            const studentNote = new StudentNote(unpersistedStudentNotes[0]);
            await expect(studentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/note.title index', async () => {
            const studentNote = new StudentNote(unpersistedStudentNotes[1]);
            await expect(studentNote.save()).to.eventually.be.eql(studentNote);
        });

    });

    afterEach(db.teardown(uniqueStudentNoteContext.persisted));

});
