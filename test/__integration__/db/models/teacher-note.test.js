const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { TeacherNote } = require('../../../../src/db/models');

const { uniqueTeacherNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/teacher-note] - uniqueTeacherNote context', () => {

    beforeEach(db.init(uniqueTeacherNoteContext.persisted));

    describe('[db/models/teacher-note] - user/file.originalname index', () => {

        const unpersistedTeacherNotes = uniqueTeacherNoteContext.unpersisted[names.teacherNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const teacherNote = new TeacherNote(unpersistedTeacherNotes[0]);
            await expect(teacherNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const teacherNote = new TeacherNote(unpersistedTeacherNotes[1]);
            await expect(teacherNote.save()).to.eventually.be.eql(teacherNote);
        });

    });

    afterEach(db.teardown(uniqueTeacherNoteContext.persisted));

});
