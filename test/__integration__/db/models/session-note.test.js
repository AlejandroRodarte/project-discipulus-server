const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session-note] - uniqueSessionNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionNoteContext.persisted));

    describe('[db/models/session-note] - user/file.originalname index', () => {

        const unpersistedSessionNotes = fixtures.models.uniqueSessionNoteContext.unpersisted[shared.db.names.sessionNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const sessionNote = new db.models.SessionNote(unpersistedSessionNotes[0]);
            await expect(sessionNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const sessionNote = new db.models.SessionNote(unpersistedSessionNotes[1]);
            await expect(sessionNote.save()).to.eventually.be.eql(sessionNote);
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionNoteContext.persisted));

});