const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session-student-note] - uniqueSessionStudentNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionStudentNoteContext.persisted));

    describe('[db/models/session-student-note] - sessionStudent/note.title index', () => {

        const unpersistedSessionStudentNotes = fixtures.models.uniqueSessionStudentNoteContext.unpersisted[shared.db.names.sessionStudentNote.modelName];

        it('Should fail on duplicate sessionStudent/note.title index', async () => {
            const sessionStudentNote = new db.models.SessionStudentNote(unpersistedSessionStudentNotes[0]);
            await expect(sessionStudentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique sessionStudent/note.title index', async () => {
            const sessionStudentNote = new db.models.SessionStudentNote(unpersistedSessionStudentNotes[1]);
            await expect(sessionStudentNote.save()).to.eventually.be.eql(sessionStudentNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionStudentNoteContext.persisted));

});