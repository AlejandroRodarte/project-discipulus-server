const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { ParentNote } = require('../../../../src/db/models');

const { uniqueParentNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/parent-note] - uniqueParentNote context', () => {

    beforeEach(db.init(uniqueParentNoteContext.persisted));

    describe('[db/models/parent-note] - user/file.originalname index', () => {

        const unpersistedParentNotes = uniqueParentNoteContext.unpersisted[names.parentNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const parentNote = new ParentNote(unpersistedParentNotes[0]);
            await expect(parentNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const parentNote = new ParentNote(unpersistedParentNotes[1]);
            await expect(parentNote.save()).to.eventually.be.eql(parentNote);
        });

    });

    afterEach(db.teardown(uniqueParentNoteContext.persisted));

});
