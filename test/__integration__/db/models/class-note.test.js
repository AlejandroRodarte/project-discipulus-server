const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ClassNote } = require('../../../../src/db/models');

const { uniqueClassNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

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
